import { Landing } from '@/shared/types/blocks/landing';
import {
  CTA,
  FAQ,
  Features,
  FeaturesList,
  FeaturesStep,
  Hero,
  Logos,
  Stats,
  Subscribe,
} from '@/themes/default/blocks';

export default function LandingPage({ page }: { page: Landing }) {
  return (
    <>
      {page.hero && <Hero hero={page.hero} />}
      {page.logos && <Logos logos={page.logos} />}
      {page.introduce && <FeaturesList features={page.introduce} />}
      {page.benefits && (
        <FeaturesList features={page.benefits} className="bg-muted/40" />
      )}
      {page.usage && <FeaturesStep features={page.usage} />}
      {page.features && <Features features={page.features} />}
      {page.stats && <Stats stats={page.stats} className="bg-muted/30" />}
      {page.faq && <FAQ faq={page.faq} />}
      {page.cta && <CTA cta={page.cta} className="bg-muted/40" />}
      {page.subscribe && (
        <Subscribe subscribe={page.subscribe} className="bg-muted" />
      )}
    </>
  );
}
