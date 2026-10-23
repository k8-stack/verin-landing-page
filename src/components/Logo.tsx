/** Verin's own mark: many market signals converging on one clear point. Not derived from Base identifiers. */
export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`logo${inverse ? ' logo--inverse' : ''}`}>
      <svg className="logo__mark" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
        <rect width="32" height="32" rx="7" className="logo__tile" />
        <path d="M8 9l8 14 8-14" className="logo__stroke" />
        <circle cx="16" cy="23" r="3" className="logo__dot" />
      </svg>
      <span className="logo__word">verin</span>
    </span>
  );
}
