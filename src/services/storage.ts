import { ProfileData, AdminSettings } from '../types';

const PROFILES_STORAGE_KEY = 'zakaty_digital_profiles_v2';
const SETTINGS_STORAGE_KEY = 'zakaty_admin_settings_v2';

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  founderName: 'ABDESSAMIA ABDERRAZAK',
  founderCountry: 'Spain',
  contactEmail: 'abderrazak.abdessamia5@gmail.com',
  showPhonePublicly: false,
  allowDonations: true,
  buyMeACoffeeUrl: 'https://buymeacoffee.com/zakaty',
  paypalDonateUrl: 'https://paypal.me/zakatytools',
  maintenanceMode: false,
  googleOAuthClientId: '',
};

export const INITIAL_PROFILES: ProfileData[] = [
  {
    id: 'p-founder-001',
    slug: 'abdessamia-abderrazak',
    fullName: 'ABDESSAMIA ABDERRAZAK',
    title: 'Lead Software Architect & Tech Founder',
    company: 'ZakaTy Global Tools',
    category: 'Software & Technology',
    bio: 'Software engineer based in Spain. Passionate about building accessible, privacy-first web tools, high-performance cloud architecture, and digital business identities for professionals worldwide.',
    companyDescription: 'ZakaTy delivers 100% free browser-side file utilities and digital business cards without paywalls or privacy invasion.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    ],
    phone: '+34 600 000 000',
    whatsapp: '+34 600 000 000',
    email: 'abderrazak.abdessamia5@gmail.com',
    website: 'https://zakaty.tools',
    address: 'Madrid / Barcelona, Spain',
    openingHours: 'Mon - Fri: 09:00 - 18:00 (CET)',
    socialLinks: {
      whatsapp: 'https://wa.me/34600000000',
      instagram: 'https://instagram.com/zakaty',
      linkedin: 'https://linkedin.com/in/abdessamia-abderrazak',
      x: 'https://x.com/zakaty',
      facebook: 'https://facebook.com/zakaty',
      youtube: 'https://youtube.com/@zakaty',
      telegram: 'https://t.me/zakaty',
      github: 'https://github.com/zakaty',
    },
    googleLinks: {
      mapsUrl: 'https://maps.google.com/?q=Spain',
      reviewsUrl: 'https://search.google.com/local/writereview?placeid=ChIJgTwKgJcpQg0RaSKMYcHeNsQ',
      businessUrl: 'https://zakaty.tools',
    },
    themeColor: 'indigo',
    cardStyle: 'modern',
    status: 'published',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-10-17T12:00:00.000Z',
    viewsCount: 342,
    vcardDownloadsCount: 88,
    sharesCount: 54,
  },
  {
    id: 'p-studio-002',
    slug: 'lumina-creative',
    fullName: 'Elena Rostova',
    title: 'Creative Director & Brand Strategist',
    company: 'Lumina Design Studio',
    category: 'Design & Architecture',
    bio: 'Crafting memorable brand identities, digital experiences, and high-impact visual campaigns for modern businesses across Europe.',
    companyDescription: 'Full-service design agency specializing in minimal branding, web development, and digital marketing.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    ],
    phone: '+34 611 223 344',
    whatsapp: '+34 611 223 344',
    email: 'hello@luminastudio.example',
    website: 'https://luminastudio.example',
    address: 'Passeig de Gràcia 45, Barcelona, Spain',
    openingHours: 'Mon - Sat: 10:00 - 19:00',
    socialLinks: {
      whatsapp: 'https://wa.me/34611223344',
      instagram: 'https://instagram.com/lumina',
      linkedin: 'https://linkedin.com/company/lumina',
      facebook: 'https://facebook.com/lumina',
      youtube: 'https://youtube.com',
      tiktok: 'https://tiktok.com/@lumina',
    },
    googleLinks: {
      mapsUrl: 'https://maps.google.com/?q=Barcelona',
      reviewsUrl: 'https://search.google.com/local/writereview?placeid=ChIJ5TCOcRaYpBIRa4-n5p5p5p5',
      businessUrl: 'https://luminastudio.example',
    },
    themeColor: 'rose',
    cardStyle: 'glass',
    status: 'published',
    createdAt: '2026-02-14T14:30:00.000Z',
    updatedAt: '2026-10-15T09:15:00.000Z',
    viewsCount: 189,
    vcardDownloadsCount: 42,
    sharesCount: 29,
  },
];

export function getStoredProfiles(): ProfileData[] {
  if (typeof window === 'undefined') return INITIAL_PROFILES;
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(INITIAL_PROFILES));
      return INITIAL_PROFILES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Merge in any initial seed updates like coverUrl or galleryImages if missing
      const merged = parsed.map((item: ProfileData) => {
        const seedMatch = INITIAL_PROFILES.find((s) => s.slug === item.slug);
        if (seedMatch) {
          return {
            ...seedMatch,
            ...item,
            coverUrl: item.coverUrl || seedMatch.coverUrl,
            logoUrl: item.logoUrl || seedMatch.logoUrl,
            galleryImages: (item.galleryImages && item.galleryImages.length > 0) ? item.galleryImages : seedMatch.galleryImages,
            socialLinks: {
              ...seedMatch.socialLinks,
              ...item.socialLinks,
            },
          };
        }
        return item;
      });
      return merged;
    }
    return INITIAL_PROFILES;
  } catch (err) {
    console.error('Failed to read profiles from storage', err);
    return INITIAL_PROFILES;
  }
}

export function saveProfiles(profiles: ProfileData[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch (err) {
    console.error('Failed to save profiles to storage', err);
  }
}

export function getProfileBySlug(slug: string): ProfileData | undefined {
  const clean = (slug || '').trim().toLowerCase();
  const profiles = getStoredProfiles();
  return profiles.find((p) => p.slug.toLowerCase() === clean);
}

export function getProfileById(id: string): ProfileData | undefined {
  const profiles = getStoredProfiles();
  return profiles.find((p) => p.id === id);
}

export function upsertProfile(profile: ProfileData): void {
  const profiles = getStoredProfiles();
  const index = profiles.findIndex((p) => p.id === profile.id);
  const now = new Date().toISOString();

  if (index >= 0) {
    profiles[index] = { ...profile, updatedAt: now };
  } else {
    profiles.unshift({ ...profile, createdAt: now, updatedAt: now });
  }

  saveProfiles(profiles);
}

export function deleteProfile(id: string): void {
  const profiles = getStoredProfiles().filter((p) => p.id !== id);
  saveProfiles(profiles);
}

export function recordProfileView(slug: string): void {
  const profiles = getStoredProfiles();
  const target = profiles.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  if (target) {
    target.viewsCount = (target.viewsCount || 0) + 1;
    saveProfiles(profiles);
  }
}

export function recordVCardDownload(slug: string): void {
  const profiles = getStoredProfiles();
  const target = profiles.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  if (target) {
    target.vcardDownloadsCount = (target.vcardDownloadsCount || 0) + 1;
    saveProfiles(profiles);
  }
}

export function recordShare(slug: string): void {
  const profiles = getStoredProfiles();
  const target = profiles.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  if (target) {
    target.sharesCount = (target.sharesCount || 0) + 1;
    saveProfiles(profiles);
  }
}

export function getStoredAdminSettings(): AdminSettings {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_ADMIN_SETTINGS;
    return { ...DEFAULT_ADMIN_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ADMIN_SETTINGS;
  }
}

export function saveAdminSettings(settings: AdminSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save admin settings', err);
  }
}
