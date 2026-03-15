import type { Schema, Struct } from '@strapi/strapi';

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
