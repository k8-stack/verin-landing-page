import { AlertCircle, CheckCircle2, Copy, Info, Loader2, Mail } from 'lucide-react';
import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { CONTACT_EMAIL, INQUIRY_ENDPOINT, INQUIRY_TYPES, USE_CASES, type InquiryType } from '../site';

interface Values {
  name: string;
  email: string;
  company: string;
  role: string;
  website: string;
  type: InquiryType | '';
  useCase: string;
  message: string;
  requirements: string;
  /** Honeypot — hidden from people, often filled by bots. */
  fax: string;
}

type Errors = Partial<Record<keyof Values, string>>;
type Status = 'idle' | 'submitting' | 'sent' | 'failed' | 'unconfigured';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i;
const ORDER: (keyof Values)[] = ['name', 'email', 'company', 'role', 'website', 'type', 'useCase', 'message', 'requirements'];

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = 'Enter your name.';
  if (!v.email.trim()) e.email = 'Enter your work email.';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter an email address like name@company.com.';
  if (!v.company.trim()) e.company = 'Enter your company name.';
  if (!v.role.trim()) e.role = 'Enter your role, e.g. CTO or Product lead.';
  if (v.website.trim() && !URL_RE.test(v.website.trim())) e.website = 'Enter a web address like company.com, or leave this blank.';
  if (!v.type) e.type = 'Choose what your inquiry is about.';
  if (!v.useCase) e.useCase = 'Choose the closest use case.';
  if (v.message.trim().length < 20) e.message = 'Tell us a little more — at least 20 characters.';
  if (v.message.length > 2000) e.message = 'Keep this under 2,000 characters.';
  if (v.requirements.length > 2000) e.requirements = 'Keep this under 2,000 characters.';
  return e;
}

const initialType = (): InquiryType | '' => {
  const t = new URLSearchParams(window.location.search).get('type');
  return INQUIRY_TYPES.find((x) => x.id === t)?.id ?? '';
};

const summarise = (v: Values) =>
  [
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    `Company: ${v.company}`,
    `Role: ${v.role}`,
    v.website && `Website: ${v.website}`,
    `Inquiry: ${INQUIRY_TYPES.find((t) => t.id === v.type)?.label ?? ''}`,
    `Use case: ${USE_CASES.find((u) => u.id === v.useCase)?.label ?? ''}`,
    '',
    v.message,
    v.requirements && `\nAdditional requirements:\n${v.requirements}`,
  ]
    .filter((l): l is string => typeof l === 'string' && l !== '')
    .join('\n');

function Field({
  id,
  label,
  optional,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: (describedBy: string | undefined) => ReactNode;
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field">
      <label className="field__label form__label" htmlFor={id}>
        {label}
        {optional && <span className="form__opt"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="form__hint">
          {hint}
        </p>
      )}
      {children(describedBy)}
      {error && (
        <p id={`${id}-err`} className="form__err">
          <AlertCircle size={16} aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  );
}

export function InquiryForm() {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [v, setV] = useState<Values>({
    name: '',
    email: '',
    company: '',
    role: '',
    website: '',
    type: initialType(),
    useCase: '',
    message: '',
    requirements: '',
    fax: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [failure, setFailure] = useState('');
  const [copied, setCopied] = useState<'idle' | 'done' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof Values) => (e: { target: { value: string } }) => {
    const next = { ...v, [k]: e.target.value };
    setV(next);
    if (touched) setErrors(validate(next)); // re-validate live only after first submit attempt
  };

  const focusStatus = () => requestAnimationFrame(() => statusRef.current?.focus());

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const errs = validate(v);
    setErrors(errs);
    const first = ORDER.find((k) => errs[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(first))}`)?.focus();
      return;
    }
    if (v.fax) {
      setFailure('This inquiry could not be sent.');
      setStatus('failed');
      return focusStatus();
    }
    if (!INQUIRY_ENDPOINT) {
      setStatus('unconfigured');
      return focusStatus();
    }

    setStatus('submitting');
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 15_000);
    try {
      const res = await fetch(INQUIRY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: v.name.trim(),
          email: v.email.trim(),
          company: v.company.trim(),
          role: v.role.trim(),
          website: v.website.trim() || null,
          type: v.type,
          useCase: v.useCase,
          message: v.message.trim(),
          requirements: v.requirements.trim() || null,
          page: window.location.href,
          submittedAt: new Date().toISOString(),
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`The server responded with status ${res.status}.`);
      setStatus('sent');
    } catch (err) {
      setFailure(
        ctrl.signal.aborted
          ? 'The request timed out.'
          : err instanceof TypeError
            ? 'We couldn’t reach the server. Check your connection.'
            : (err as Error).message,
      );
      setStatus('failed');
    } finally {
      window.clearTimeout(timer);
      focusStatus();
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summarise(v));
      setCopied('done');
    } catch {
      setCopied('error');
    }
  };

  const mailto = CONTACT_EMAIL
    ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Verin inquiry — ${v.company || 'company'}`)}&body=${encodeURIComponent(summarise(v))}`
    : '';

  if (status === 'sent') {
    return (
      <div className="form__result form__result--ok" role="status" tabIndex={-1} ref={statusRef}>
        <CheckCircle2 size={24} aria-hidden="true" />
        <div>
          <h2 className="form__result-h">Inquiry received</h2>
          <p>
            Thanks, {v.name.split(' ')[0]}. Our server confirmed receipt of your message. We’ll reply to{' '}
            <strong>{v.email}</strong>.
          </p>
        </div>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form ref={formRef} className="form" noValidate onSubmit={onSubmit} aria-describedby={!INQUIRY_ENDPOINT ? id('cfg') : undefined}>
      {!INQUIRY_ENDPOINT && (
        <p id={id('cfg')} className="form__notice">
          <Info size={18} aria-hidden="true" />
          <span>
            Online delivery isn’t connected in this build, so this form can’t send your message yet. You can still fill
            it in — at the end you can {CONTACT_EMAIL ? 'email it to us or ' : ''}copy it.
          </span>
        </p>
      )}

      {touched && errorCount > 0 && (
        <p className="form__summary" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          {errorCount === 1 ? 'One field needs attention.' : `${errorCount} fields need attention.`}
        </p>
      )}

      <div className="form__grid">
        <Field id={id('name')} label="Name" error={errors.name}>
          {(d) => (
            <input id={id('name')} className="input" autoComplete="name" value={v.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={d} maxLength={100} />
          )}
        </Field>
        <Field id={id('email')} label="Work email" error={errors.email}>
          {(d) => (
            <input id={id('email')} className="input" type="email" autoComplete="email" inputMode="email" value={v.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={d} maxLength={200} />
          )}
        </Field>
        <Field id={id('company')} label="Company" error={errors.company}>
          {(d) => (
            <input id={id('company')} className="input" autoComplete="organization" value={v.company} onChange={set('company')} aria-invalid={!!errors.company} aria-describedby={d} maxLength={150} />
          )}
        </Field>
        <Field id={id('role')} label="Role" error={errors.role}>
          {(d) => (
            <input id={id('role')} className="input" autoComplete="organization-title" value={v.role} onChange={set('role')} aria-invalid={!!errors.role} aria-describedby={d} maxLength={100} />
          )}
        </Field>
        <Field id={id('website')} label="Company website" optional error={errors.website}>
          {(d) => (
            <input id={id('website')} className="input" inputMode="url" autoComplete="url" placeholder="company.com" value={v.website} onChange={set('website')} aria-invalid={!!errors.website} aria-describedby={d} maxLength={200} />
          )}
        </Field>
        <Field id={id('type')} label="What is this about?" error={errors.type}>
          {(d) => (
            <select id={id('type')} className="input" value={v.type} onChange={set('type')} aria-invalid={!!errors.type} aria-describedby={d}>
              <option value="">Choose one</option>
              {INQUIRY_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field id={id('useCase')} label="Closest use case" error={errors.useCase}>
          {(d) => (
            <select id={id('useCase')} className="input" value={v.useCase} onChange={set('useCase')} aria-invalid={!!errors.useCase} aria-describedby={d}>
              <option value="">Choose one</option>
              {USE_CASES.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <Field id={id('message')} label="What do you want to build or solve?" hint="A few sentences is plenty." error={errors.message}>
        {(d) => (
          <textarea id={id('message')} className="input input--area" rows={5} value={v.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby={d} maxLength={2100} />
        )}
      </Field>
      <Field
        id={id('requirements')}
        label="Additional requirements"
        optional
        hint="Networks, expected request volume, latency, timeline — whatever matters to you."
        error={errors.requirements}
      >
        {(d) => (
          <textarea id={id('requirements')} className="input input--area" rows={4} value={v.requirements} onChange={set('requirements')} aria-invalid={!!errors.requirements} aria-describedby={d} maxLength={2100} />
        )}
      </Field>

      <div className="form__hp" aria-hidden="true">
        <label>
          Fax
          <input tabIndex={-1} autoComplete="off" value={v.fax} onChange={set('fax')} />
        </label>
      </div>

      {status === 'unconfigured' && (
        <div className="form__result form__result--warn" role="status" tabIndex={-1} ref={statusRef}>
          <Info size={24} aria-hidden="true" />
          <div>
            <h2 className="form__result-h">Not sent — delivery isn’t connected</h2>
            <p>Your inquiry is complete but nothing was transmitted. {CONTACT_EMAIL ? 'Email it to us or copy it:' : 'Copy it to send another way:'}</p>
            <div className="form__actions">
              {mailto && (
                <a className="btn btn--sm" href={mailto}>
                  <Mail size={16} aria-hidden="true" /> Email {CONTACT_EMAIL}
                </a>
              )}
              <button type="button" className="btn btn--sm btn--secondary" onClick={copy}>
                <Copy size={16} aria-hidden="true" />
                <span aria-live="polite">{copied === 'done' ? 'Copied' : copied === 'error' ? 'Copy failed' : 'Copy inquiry'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'failed' && (
        <div className="form__result form__result--err" role="alert" tabIndex={-1} ref={statusRef}>
          <AlertCircle size={24} aria-hidden="true" />
          <div>
            <h2 className="form__result-h">Your inquiry wasn’t sent</h2>
            <p>
              {failure} Your answers are still here — try again{CONTACT_EMAIL ? <>, or email <a href={mailto}>{CONTACT_EMAIL}</a></> : ''}.
            </p>
          </div>
        </div>
      )}

      <div className="form__submit">
        <button type="submit" className="btn btn--lg" disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
          {status === 'submitting' ? (
            <>
              <Loader2 size={18} aria-hidden="true" className="spin" /> Sending…
            </>
          ) : status === 'failed' ? (
            'Try again'
          ) : (
            'Send inquiry'
          )}
        </button>
        <p className="form__hint">
          We use these details only to reply to you. See the <a href="/privacy/">privacy notice</a>.
        </p>
      </div>
    </form>
  );
}
