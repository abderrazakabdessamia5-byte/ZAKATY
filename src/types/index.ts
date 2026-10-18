export type Language = 'en' | 'ar' | 'fr' | 'es';

export type ToolCategory = 'all' | 'pdf' | 'image' | 'qr-nfc' | 'profile';

export interface ToolItem {
  id: string;
  category: 'pdf' | 'image' | 'qr-nfc' | 'profile';
  titleKey: string;
  descriptionKey: string;
  icon: string;
  badge?: string;
  supportedFormats: string[];
  route: string;
}

export type ThemeColor = 'rose' | 'indigo' | 'emerald' | 'amber' | 'cyan' | 'slate';
export type CardStyle = 'modern' | 'minimal' | 'glass' | 'corporate';

export interface SocialLinks {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  x?: string;
  whatsapp?: string;
  telegram?: string;
  github?: string;
}

export interface GoogleLinks {
  mapsUrl?: string;
  reviewsUrl?: string;
  businessUrl?: string;
}

export interface ProfileData {
  id: string;
  slug: string;
  fullName: string;
  title: string;
  company: string;
  category: string;
  bio: string;
  companyDescription?: string;
  avatarUrl: string;
  logoUrl?: string;
  coverUrl?: string;
  galleryImages?: string[];
  phone: string;
  whatsapp?: string;
  email: string;
  website?: string;
  address?: string;
  openingHours?: string;
  socialLinks: SocialLinks;
  googleLinks: GoogleLinks;
  themeColor: ThemeColor;
  cardStyle: CardStyle;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  viewsCount: number;
  vcardDownloadsCount: number;
  sharesCount: number;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AdminSettings {
  founderName: string;
  founderCountry: string;
  contactEmail: string;
  showPhonePublicly: boolean;
  allowDonations: boolean;
  buyMeACoffeeUrl: string;
  paypalDonateUrl: string;
  maintenanceMode: boolean;
  googleOAuthClientId: string;
}
