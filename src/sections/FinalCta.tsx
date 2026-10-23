import { ArrowRight } from 'lucide-react';

const NEXT = [
  ['Discover', 'Find any token in the preview across four networks.'],
  ['Understand', 'Read its price history, market stats and liquidity by pool.'],
  ['Build', 'Tell us what data you’d integrate into your own product.'],
] as const;

export function FinalCta() {
  return (
    <section className="final" aria-labelledby="final-title">
      <div className="container final__inner">
        <div className="final__main">
          <span className="dot-label final__label">Verin · Preview</span>
          <h2 id="final-title" className="final__title">
            See the market behind every price.
          </h2>
          <a href="#preview" className="btn btn--lg btn--inverse">
            Explore Verin <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
        <ol className="final__steps" aria-label="What you can do in the preview">
          {NEXT.map(([title, text], i) => (
            <li key={title}>
              <span className="dot-label final__n" aria-hidden="true">
                0{i + 1}
              </span>
              <span>
                <strong>{title}.</strong> {text}
              </span>
            </li>
          ))}
          <li className="final__fine">
            No account needed. Sample data only. <a href="/contact/">Talk to our team</a> about data access.
          </li>
        </ol>
      </div>
    </section>
  );
}
