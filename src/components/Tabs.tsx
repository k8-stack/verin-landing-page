import { useRef, type KeyboardEvent, type ReactNode } from 'react';

interface TabsProps<T extends string> {
  label: string;
  items: readonly { id: T; label: ReactNode }[];
  value: T;
  onChange: (id: T) => void;
  idBase: string;
  className?: string;
  tabClassName?: string;
  orientation?: 'horizontal' | 'vertical';
}

/** WAI-ARIA tablist with roving tabindex and arrow-key navigation. */
export function Tabs<T extends string>({
  label,
  items,
  value,
  onChange,
  idBase,
  className = 'seg',
  tabClassName = 'seg__btn',
  orientation = 'horizontal',
}: TabsProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const last = items.length - 1;
    const next =
      e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (i === last ? 0 : i + 1)
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (i === 0 ? last : i - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : -1;
    if (next < 0) return;
    e.preventDefault();
    onChange(items[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} aria-orientation={orientation} className={className}>
      {items.map((item, i) => (
        <button
          key={item.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="tab"
          id={`${idBase}-tab-${item.id}`}
          aria-controls={`${idBase}-panel`}
          aria-selected={value === item.id}
          tabIndex={value === item.id ? 0 : -1}
          className={tabClassName}
          onClick={() => onChange(item.id)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

/** Group of mutually exclusive toggle buttons (for filters/settings rather than panels). */
export function Segmented<T extends string>({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="seg">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className="seg__btn"
          aria-pressed={value === item.id}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
