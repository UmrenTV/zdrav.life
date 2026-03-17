import Image from 'next/image';
import { generateMetadata as genMeta } from '@/lib/seo/metadata';
import { getSiteConfig, getAboutPage } from '@/lib/data/data-source';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Code, Dumbbell, Bike, Brain, Target, Zap, Mountain } from 'lucide-react';
import { getLucideIcon } from '@/lib/lucide-icon';
import { MarkdownText } from '@/components/shared/markdown-text';
import Link from 'next/link';

export async function generateMetadata() {
  const config = await getSiteConfig();
  return genMeta(
    {
      title: 'About',
      description: 'Learn about ZdravLife - a software engineer\'s journey into high-performance living. Discover the philosophy behind discipline, systems thinking, and the pursuit of vitality.',
      ogType: 'website',
    },
    config
  );
}

const DEFAULT_VALUES = [
  {
    icon: 'Target',
    title: 'Discipline Over Motivation',
    description: 'Systems beat willpower. Build habits that persist when motivation fades.',
  },
  {
    icon: 'Zap',
    title: 'Consistency Over Intensity',
    description: 'Small actions, repeated daily, compound into extraordinary results.',
  },
  {
    icon: 'Brain',
    title: 'Systems Thinking',
    description: 'Approach life like an engineer. Measure inputs, observe outputs, iterate.',
  },
  {
    icon: 'Mountain',
    title: 'The Long Game',
    description: 'Think in years, not weeks. Sustainable progress beats quick fixes.',
  },
];

const DEFAULT_STATS = [
  { value: '5+', label: 'Years Training' },
  { value: '10+', label: 'Years Coding' },
  { value: '50K+', label: 'KM Ridden' },
  { value: '100+', label: 'Videos Created' },
];

const DEFAULT_ICON_TEXTS = [
  { icon: 'Code', text: 'Engineering' },
  { icon: 'Dumbbell', text: 'Training' },
  { icon: 'Bike', text: 'Adventure' },
];

const FALLBACK_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Target, Zap, Brain, Mountain, Code, Dumbbell, Bike, ArrowRight,
};

function resolveIcon(iconName: string | undefined): React.ComponentType<{ className?: string }> | null {
  if (!iconName) return null;
  return getLucideIcon(iconName) ?? FALLBACK_ICON_MAP[iconName] ?? null;
}

export default async function AboutPage() {
  const [config, about] = await Promise.all([getSiteConfig(), getAboutPage()]);
  const siteName = config.name || 'ZdravLife';

  const hero = about?.hero;
  const main = about?.main;
  const stats = about?.stats?.length ? about.stats : DEFAULT_STATS;
  const valuesSection = about?.valuesSection;
  const values = about?.values?.length ? about.values : DEFAULT_VALUES;
  const cta = about?.cta;
  const iconTexts = main?.iconTexts?.length ? main.iconTexts : DEFAULT_ICON_TEXTS;

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            {hero?.pillText || 'The Story'}
          </span>
          <h1 className="text-heading-1 font-heading font-bold mb-6">
            {hero?.headingLine1 || 'Engineer by Profession.'}
            <br />
            <span className="text-gradient">{hero?.headingAccent || 'Athlete by Choice.'}</span>
          </h1>
          <MarkdownText as="p" className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {hero?.subheading || 'I\'m a software engineer who approaches health and fitness with the same systematic rigor I apply to code. This is my journey into high-performance living.'}
          </MarkdownText>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <Image
                src={main?.image || '/images/about-portrait.jpg'}
                alt={main?.imageAlt || 'Zdrav - Software Engineer & Athlete'}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-vitality/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Content */}
          <div className="space-y-6 min-w-0">
            <div>
              <h2 className="text-heading-2 font-heading font-semibold mb-4">
                {main?.headingIntro || 'The Beginning'}
              </h2>
              <MarkdownText as="p" className="text-muted-foreground">
                {main?.bodyIntro || 'Three years ago, I cancelled my gym membership. Not because I was giving up on fitness, but because I wanted to prove a point: that the most sophisticated piece of equipment you\'ll ever own is your own body.'}
              </MarkdownText>
            </div>

            <div>
              <h3 className="text-heading-4 font-heading font-semibold mb-3">
                {main?.headingPhilosophy || 'The Philosophy'}
              </h3>
              <MarkdownText as="p" className="text-muted-foreground mb-4">
                {main?.bodyPhilosophy1 || `${siteName} is built on a simple principle: approach your body and life with the same systematic thinking you apply to complex engineering problems. Measure inputs. Observe outputs. Iterate.`}
              </MarkdownText>
              <MarkdownText as="p" className="text-muted-foreground">
                {main?.bodyPhilosophy2 || 'This isn\'t about being perfect. It\'s about being consistent. It\'s about building systems that work when motivation fails. It\'s about the long game.'}
              </MarkdownText>
            </div>

            {/* Icons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4">
              {iconTexts.map((item) => {
                const Icon = resolveIcon(item.icon);
                return (
                  <div key={item.text} className="flex items-center gap-2">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                      {Icon && <Icon className="h-5 w-5 text-primary" />}
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-muted/30 py-16 mb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-heading-2 font-heading font-semibold mb-4">
            {valuesSection?.heading || 'Core Principles'}
          </h2>
          <MarkdownText as="p" className="text-muted-foreground">
            {valuesSection?.subheading || 'The values that guide everything I do, from training to content creation.'}
          </MarkdownText>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {values.map((value) => {
            const Icon = resolveIcon(value.icon);
            return (
              <div
                key={value.title}
                className="p-6 bg-card border rounded-xl hover:border-primary/30 transition-colors"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {Icon && <Icon className="h-6 w-6 text-primary" />}
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {value.title}
                </h3>
                <MarkdownText as="p" className="text-muted-foreground text-sm">{value.description}</MarkdownText>
              </div>
            );
          })}
        </div>
      </section>

      <Separator className="mb-24" />

      {/* CTA */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-heading-2 font-heading font-semibold mb-4">
            {cta?.heading || 'Ready to Start Your Journey?'}
          </h2>
          <MarkdownText as="p" className="text-muted-foreground mb-8">
            {cta?.subheading || 'Explore the blog for training protocols, nutrition strategies, and mindset insights. Or check out the shop for gear that supports your pursuit of vitality.'}
          </MarkdownText>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="group">
              <Link href={cta?.primaryHref || '/blog'}>
                {cta?.primaryLabel || 'Explore the Blog'}
                {(() => {
                  const PrimaryIcon = resolveIcon(cta?.primaryIcon || 'ArrowRight');
                  return PrimaryIcon ? <PrimaryIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /> : null;
                })()}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={cta?.secondaryHref || '/shop'}>
                {cta?.secondaryLabel || 'Visit the Shop'}
                {(() => {
                  const SecondaryIcon = cta?.secondaryIcon ? resolveIcon(cta.secondaryIcon) : null;
                  return SecondaryIcon ? <SecondaryIcon className="ml-2 h-4 w-4" /> : null;
                })()}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
