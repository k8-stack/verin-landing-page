import { Layout } from './components/Layout';
import { Capabilities } from './sections/Capabilities';
import { FinalCta } from './sections/FinalCta';
import { ForTeams } from './sections/ForTeams';
import { Hero } from './sections/Hero';
import { ProductPreview } from './sections/preview/ProductPreview';
import { Transparency } from './sections/Transparency';
import { Walkthrough } from './sections/Walkthrough';

export function App() {
  return (
    <Layout>
      <Hero />
      <ProductPreview />
      <Capabilities />
      <Walkthrough />
      <Transparency />
      <ForTeams />
      <FinalCta />
    </Layout>
  );
}
