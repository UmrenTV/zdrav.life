import type { Schema, Struct } from '@strapi/strapi';

export interface AboutCta extends Struct.ComponentSchema {
  collectionName: 'components_about_ctas';
  info: {
    description: 'Bottom CTA on About page';
    displayName: 'About CTA';
  };
  attributes: {
    heading: Schema.Attribute.String;
    primaryHref: Schema.Attribute.String;
    primaryIcon: Schema.Attribute.String;
    primaryLabel: Schema.Attribute.String;
    secondaryHref: Schema.Attribute.String;
    secondaryIcon: Schema.Attribute.String;
    secondaryLabel: Schema.Attribute.String;
    subheading: Schema.Attribute.Text;
  };
}

export interface AboutHero extends Struct.ComponentSchema {
  collectionName: 'components_about_heroes';
  info: {
    description: 'About page hero: pill, heading, accent, subheading';
    displayName: 'About hero';
  };
  attributes: {
    headingAccent: Schema.Attribute.String;
    headingLine1: Schema.Attribute.String;
    pillText: Schema.Attribute.String;
    subheading: Schema.Attribute.Text;
  };
}

export interface AboutMain extends Struct.ComponentSchema {
  collectionName: 'components_about_mains';
  info: {
    description: 'Main story + philosophy content and icons';
    displayName: 'About main';
  };
  attributes: {
    bodyIntro: Schema.Attribute.Text;
    bodyPhilosophy1: Schema.Attribute.Text;
    bodyPhilosophy2: Schema.Attribute.Text;
    headingIntro: Schema.Attribute.String;
    headingPhilosophy: Schema.Attribute.String;
    iconTexts: Schema.Attribute.Component<'home.icon-text', true>;
    image: Schema.Attribute.Media<'images'>;
    imageAlt: Schema.Attribute.String;
  };
}

export interface AboutSectionHeading extends Struct.ComponentSchema {
  collectionName: 'components_about_section_headings';
  info: {
    description: 'Section title + subheading for About page blocks';
    displayName: 'About section heading';
  };
  attributes: {
    heading: Schema.Attribute.String;
    subheading: Schema.Attribute.Text;
  };
}

export interface AboutValue extends Struct.ComponentSchema {
  collectionName: 'components_about_values';
  info: {
    description: 'Single core principle card';
    displayName: 'Core value';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface HomeAboutPreview extends Struct.ComponentSchema {
  collectionName: 'components_home_about_previews';
  info: {
    description: 'About siteName block on home: image, stats, copy, icon labels, CTA';
    displayName: 'About preview';
  };
  attributes: {
    buttonHref: Schema.Attribute.String;
    buttonIcon: Schema.Attribute.String;
    buttonLabel: Schema.Attribute.String;
    description: Schema.Attribute.RichText;
    eyebrow: Schema.Attribute.String;
    headingAccent: Schema.Attribute.String;
    headingLine1: Schema.Attribute.String;
    headingLine2: Schema.Attribute.String;
    iconTexts: Schema.Attribute.Component<'home.icon-text', true>;
    image: Schema.Attribute.Media<'images'>;
    imageAlt: Schema.Attribute.String;
    imageStats: Schema.Attribute.Component<'layout.stat-item', true>;
  };
}

export interface HomeCta extends Struct.ComponentSchema {
  collectionName: 'components_home_ctas';
  info: {
    description: 'Bottom CTA banner: heading, subheading, primary and secondary buttons';
    displayName: 'Home CTA';
  };
  attributes: {
    heading: Schema.Attribute.String;
    primaryButton: Schema.Attribute.Component<'home.cta-button', false>;
    secondaryButton: Schema.Attribute.Component<'home.cta-button', false>;
    subheading: Schema.Attribute.Text;
  };
}

export interface HomeCtaButton extends Struct.ComponentSchema {
  collectionName: 'components_home_cta_buttons';
  info: {
    description: 'Button in CTA banner: label, href, optional icon';
    displayName: 'CTA button';
  };
  attributes: {
    href: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String;
  };
}

export interface HomeFeaturedGalleryItem extends Struct.ComponentSchema {
  collectionName: 'components_home_featured_gallery_items';
  info: {
    description: 'Select a gallery item for the featured content section';
    displayName: 'Featured gallery item';
  };
  attributes: {
    galleryItem: Schema.Attribute.Relation<
      'manyToOne',
      'api::gallery-item.gallery-item'
    >;
  };
}

export interface HomeFeaturedPost extends Struct.ComponentSchema {
  collectionName: 'components_home_featured_posts';
  info: {
    description: 'Select a blog post for the featured content section';
    displayName: 'Featured post';
  };
  attributes: {
    post: Schema.Attribute.Relation<'manyToOne', 'api::post.post'>;
  };
}

export interface HomeFeaturedProduct extends Struct.ComponentSchema {
  collectionName: 'components_home_featured_products';
  info: {
    description: 'Select a product for the featured content section';
    displayName: 'Featured product';
  };
  attributes: {
    product: Schema.Attribute.Relation<'manyToOne', 'api::product.product'>;
  };
}

export interface HomeFeaturedVideo extends Struct.ComponentSchema {
  collectionName: 'components_home_featured_videos';
  info: {
    description: 'Select a video for the featured content section';
    displayName: 'Featured video';
  };
  attributes: {
    video: Schema.Attribute.Relation<'manyToOne', 'api::video.video'>;
  };
}

export interface HomeHero extends Struct.ComponentSchema {
  collectionName: 'components_home_heroes';
  info: {
    description: 'Hero block: pill, two-line heading (white + accent), subheading, buttons, stats';
    displayName: 'Home hero';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'home.hero-button', true>;
    headingAccent: Schema.Attribute.String;
    headingWhite: Schema.Attribute.String;
    pillText: Schema.Attribute.String;
    stats: Schema.Attribute.Component<'home.hero-stat', true>;
    subheading: Schema.Attribute.Text;
  };
}

export interface HomeHeroButton extends Struct.ComponentSchema {
  collectionName: 'components_home_hero_buttons';
  info: {
    description: 'CTA in hero: label, href, optional icon (Lucide name), position left or right';
    displayName: 'Hero button';
  };
  attributes: {
    href: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    iconPosition: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'right'>;
    label: Schema.Attribute.String;
  };
}

export interface HomeHeroStat extends Struct.ComponentSchema {
  collectionName: 'components_home_hero_stats';
  info: {
    description: 'Stat row: value (e.g. 50K+), label (e.g. Subscribers)';
    displayName: 'Hero stat';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface HomeIconText extends Struct.ComponentSchema {
  collectionName: 'components_home_icon_texts';
  info: {
    description: 'Icon + label pair (e.g. Code + Engineering)';
    displayName: 'Icon text';
  };
  attributes: {
    icon: Schema.Attribute.String;
    text: Schema.Attribute.String;
  };
}

export interface HomeNewsletter extends Struct.ComponentSchema {
  collectionName: 'components_home_newsletters';
  info: {
    description: 'Newsletter block: pill, heading, subheading, benefits list (form is static)';
    displayName: 'Newsletter';
  };
  attributes: {
    benefits: Schema.Attribute.Component<'home.newsletter-benefit', true>;
    heading: Schema.Attribute.String;
    pillIcon: Schema.Attribute.String;
    pillLabel: Schema.Attribute.String;
    subheading: Schema.Attribute.Text;
  };
}

export interface HomeNewsletterBenefit extends Struct.ComponentSchema {
  collectionName: 'components_home_newsletter_benefits';
  info: {
    description: 'Single bullet benefit for newsletter section';
    displayName: 'Newsletter benefit';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface HomePillarItem extends Struct.ComponentSchema {
  collectionName: 'components_home_pillar_items';
  info: {
    description: 'Single pillar card: icon (Lucide), title, description, href, colorKey for hover gradient';
    displayName: 'Pillar item';
  };
  attributes: {
    colorKey: Schema.Attribute.String & Schema.Attribute.DefaultTo<'primary'>;
    description: Schema.Attribute.Text;
    href: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface HomePillars extends Struct.ComponentSchema {
  collectionName: 'components_home_pillars';
  info: {
    description: 'Explore the Pillars section: heading, subheading, list of pillar cards';
    displayName: 'Pillars';
  };
  attributes: {
    heading: Schema.Attribute.String;
    items: Schema.Attribute.Component<'home.pillar-item', true>;
    subheading: Schema.Attribute.Text;
  };
}

export interface HomeSectionHeading extends Struct.ComponentSchema {
  collectionName: 'components_home_section_headings';
  info: {
    description: 'Section title block: heading, subheading, item count, optional View All button';
    displayName: 'Section heading';
  };
  attributes: {
    enableSection: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    featuredOnly: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    heading: Schema.Attribute.String;
    latestCount: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    subheading: Schema.Attribute.Text;
    viewAllHref: Schema.Attribute.String;
    viewAllIcon: Schema.Attribute.String;
    viewAllLabel: Schema.Attribute.String;
  };
}

export interface LayoutFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_layout_faq_items';
  info: {
    description: '';
    displayName: 'FAQ item';
  };
  attributes: {
    answer: Schema.Attribute.Text;
    question: Schema.Attribute.String;
  };
}

export interface LayoutHero extends Struct.ComponentSchema {
  collectionName: 'components_layout_heroes';
  info: {
    description: '';
    displayName: 'Hero';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    primaryCta: Schema.Attribute.Component<'shared.cta', false>;
    secondaryCta: Schema.Attribute.Component<'shared.cta', false>;
    subheading: Schema.Attribute.Text;
  };
}

export interface LayoutStatItem extends Struct.ComponentSchema {
  collectionName: 'components_layout_stat_items';
  info: {
    description: '';
    displayName: 'Stat item';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface ProductSpecItem extends Struct.ComponentSchema {
  collectionName: 'components_product_spec_items';
  info: {
    description: '';
    displayName: 'Spec item';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_ctas';
  info: {
    description: '';
    displayName: 'CTA';
  };
  attributes: {
    href: Schema.Attribute.String;
    label: Schema.Attribute.String;
    variant: Schema.Attribute.String;
  };
}

export interface SharedFooterLegalLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_legal_links';
  info: {
    description: 'Legal link in footer (e.g. Privacy Policy, Terms of Service).';
    displayName: 'Footer legal link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    link: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFooterLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_links';
  info: {
    description: 'Single link inside a footer link group (label + URL).';
    displayName: 'Footer link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    link: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFooterLinkGroup extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_link_groups';
  info: {
    description: 'One box/column in the footer with a title and multiple links (e.g. Content, Training, Shop, Support).';
    displayName: 'Footer link group';
  };
  attributes: {
    links: Schema.Attribute.Component<'shared.footer-link', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedImageWithAlt extends Struct.ComponentSchema {
  collectionName: 'components_shared_image_with_alts';
  info: {
    description: '';
    displayName: 'Image with alt';
  };
  attributes: {
    alt: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedMenuLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_menu_links';
  info: {
    description: 'Single navigation item: name, link, optional icon (Lucide), open in new tab.';
    displayName: 'Menu link';
  };
  attributes: {
    icon: Schema.Attribute.String;
    link: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SharedRichLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_links';
  info: {
    description: '';
    displayName: 'Rich link';
  };
  attributes: {
    description: Schema.Attribute.Text;
    href: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'SEO';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.String;
    nofollow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    noindex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ogDescription: Schema.Attribute.Text;
    ogImage: Schema.Attribute.Media<'images'>;
    ogTitle: Schema.Attribute.String;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: '';
    displayName: 'Social link';
  };
  attributes: {
    href: Schema.Attribute.String;
    label: Schema.Attribute.String;
    platform: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.cta': AboutCta;
      'about.hero': AboutHero;
      'about.main': AboutMain;
      'about.section-heading': AboutSectionHeading;
      'about.value': AboutValue;
      'home.about-preview': HomeAboutPreview;
      'home.cta': HomeCta;
      'home.cta-button': HomeCtaButton;
      'home.featured-gallery-item': HomeFeaturedGalleryItem;
      'home.featured-post': HomeFeaturedPost;
      'home.featured-product': HomeFeaturedProduct;
      'home.featured-video': HomeFeaturedVideo;
      'home.hero': HomeHero;
      'home.hero-button': HomeHeroButton;
      'home.hero-stat': HomeHeroStat;
      'home.icon-text': HomeIconText;
      'home.newsletter': HomeNewsletter;
      'home.newsletter-benefit': HomeNewsletterBenefit;
      'home.pillar-item': HomePillarItem;
      'home.pillars': HomePillars;
      'home.section-heading': HomeSectionHeading;
      'layout.faq-item': LayoutFaqItem;
      'layout.hero': LayoutHero;
      'layout.stat-item': LayoutStatItem;
      'product.spec-item': ProductSpecItem;
      'shared.cta': SharedCta;
      'shared.footer-legal-link': SharedFooterLegalLink;
      'shared.footer-link': SharedFooterLink;
      'shared.footer-link-group': SharedFooterLinkGroup;
      'shared.image-with-alt': SharedImageWithAlt;
      'shared.menu-link': SharedMenuLink;
      'shared.rich-link': SharedRichLink;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
    }
  }
}
