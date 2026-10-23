import { networkById } from '../data/sample';
import type { NetworkId } from '../data/types';

export function NetworkTag({ id }: { id: NetworkId }) {
  return (
    <span className="net" data-net={id}>
      {networkById(id).name}
    </span>
  );
}
