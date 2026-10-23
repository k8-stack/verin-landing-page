import { dataSource } from '../data/source';

/** Shown on every surface that renders data, so sample values are never mistaken for live ones. */
export function SampleBadge({ label = 'Sample data' }: { label?: string }) {
  if (dataSource.info.kind === 'live') return null;
  return (
    <span className="badge badge--sample" title={dataSource.info.label}>
      {label}
    </span>
  );
}
