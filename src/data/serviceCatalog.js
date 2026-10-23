/**
 * Predefined Service Catalog
 * Centralized data file - easily editable
 */

export const INITIAL_SERVICES = [
  {
    id: 'meta-ads',
    name: 'Meta Ads',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 12000,
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 15000,
  },
  {
    id: 'youtube-ads',
    name: 'Youtube Ads',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 12000,
  },
  {
    id: 'youtube-seo',
    name: 'Youtube SEO',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 8000,
  },
  {
    id: 'voice-over-video',
    name: 'Voice Over Video Designs',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 10000,
  },
  {
    id: 'social-media-reels',
    name: 'Social Media Reels',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 10000,
  },
  {
    id: 'animated-graphic-posters',
    name: 'Animated Graphic Posters',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 6000,
  },
  {
    id: 'customized-posters-flyers',
    name: 'Customized Posters / Flyers',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 4000,
  },
  {
    id: 'animated-logos',
    name: 'Animated Logos',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 8000,
  },
  {
    id: 'customized-brand-logo',
    name: 'Customized Brand Logo',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 10000,
  },
  {
    id: 'static-websites',
    name: 'Static Websites',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 15000,
  },
  {
    id: 'landing-pages',
    name: 'Landing pages',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 12000,
  },
  {
    id: 'dynamic-websites',
    name: 'Dynamic Websites',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 28000,
  },
  {
    id: 'ecommerce-websites',
    name: 'E-commerce Websites',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 45000,
  },
  {
    id: 'gmb-profile-setup',
    name: 'GMB Profile Setup',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 5000,
  },
  {
    id: 'social-media-management',
    name: 'Social Media Management',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 18000,
  },
  {
    id: 'social-media-optimization',
    name: 'Social Media Optimization',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 12000,
  },
  {
    id: 'on-page-seo',
    name: 'On Page SEO',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 10000,
  },
  {
    id: 'local-seo',
    name: 'Local SEO',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 8000,
  },
  {
    id: 'complete-seo',
    name: 'Complete SEO (on-page + off-page + Technical)',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 25000,
  },
  {
    id: 'ecommerce-seo',
    name: 'E-commerce SEO',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 20000,
  },
  {
    id: 'android-mobile-app',
    name: 'Android Mobile App',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 45000,
  },
  {
    id: 'android-ios-mobile-app',
    name: 'Android + IOS Mobile App',
    defaultPlan: 'basic',
    defaultQty: 1,
    defaultAmount: 75000,
  },
];

export const CATALOG_ADDITIONAL_SERVICES = [];

export const DEFAULT_COMPANY_DETAILS = {
  name: 'Livedigit Technologies Pvt. Ltd.',
  tagline: 'Digital Transformation & Performance Growth Agency',
  email: 'hello@livedigit.com',
  phone: '+91 98765 43210',
  website: 'www.livedigit.com',
  address: 'Level 4, Cyber Gateway, HITEC City, Hyderabad, Telangana 500081, India',
  pan: 'AABCL8492Q',
  bankName: 'HDFC Bank Ltd.',
  accountNumber: '50200034981290',
  ifsc: 'HDFC0000045',
  branch: 'HITEC City, Hyderabad',
};

export const DEFAULT_CUSTOMER_DETAILS = {
  clientName: 'AcroPulse Technologies Pvt. Ltd.',
  contactPerson: 'Vikramaditya Sharma',
  email: 'vikram@acropulse.io',
  phone: '+91 98490 12345',
  billingAddress: 'Tower B, 6th Floor, Sector 62, Noida, Uttar Pradesh 201301',
};

export const DEFAULT_QUOTATION_META = {
  quotationDate: new Date().toISOString().split('T')[0],
  currency: 'INR',
  currencySymbol: '₹',
};

export const DEFAULT_TERMS_AND_CONDITIONS = [
  'Payment Schedule: 50% advance on project commencement, 30% upon milestone/beta delivery, and 20% upon final sign-off.',
  'Timeline: Delivery schedule commences once all required assets, credentials, and advance payment are received.',
  'Taxes: GST is applicable as per Government of India statutory regulations.',
  'Revisions: Includes up to 2 rounds of iterative revisions per milestone. Additional scope changes will be billed on change-request terms.',
  'Confidentiality: All project deliverables, designs, and code are proprietary to the client upon final settlement.',
];

export const DEFAULT_NOTES = 'Thank you for choosing Livedigit! We are committed to providing premium digital craft, scalable technology architecture, and exceptional ROI on your digital initiatives.';
