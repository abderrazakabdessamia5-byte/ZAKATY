import React, { useState } from 'react';
import { AdminSettings, ProfileData, Language } from '../../types';
import { getStoredAdminSettings, saveAdminSettings, getStoredProfiles, deleteProfile } from '../../services/storage';
import {
  Shield,
  Save,
  Check,
  CreditCard,
  Eye,
  Download,
  Trash2,
  ExternalLink,
  Settings,
  HeartHandshake,
  Key,
  Users,
  Activity
} from 'lucide-react';

interface AdminDashboardProps {
  currentLang: Language;
  onBack: () => void;
  onSettingsUpdated: (settings: AdminSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentLang,
  onBack,
  onSettingsUpdated,
}) => {
  const [settings, setSettings] = useState<AdminSettings>(getStoredAdminSettings());
  const [profiles, setProfiles] = useState<ProfileData[]>(getStoredProfiles());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'general' | 'donations' | 'oauth' | 'profiles'>('stats');

  const totalViews = profiles.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const totalVcards = profiles.reduce((acc, p) => acc + (p.vcardDownloadsCount || 0), 0);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdminSettings(settings);
    onSettingsUpdated(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDeleteProfile = (id: string, name: string) => {
    if (confirm(`Admin action: Are you sure you want to delete profile "${name}"?`)) {
      deleteProfile(id);
      setProfiles(getStoredProfiles());
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              ZakaTy Administration Console
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            System configuration, founder credentials, donation links, and profile management.
          </p>
        </div>

        <button
          onClick={onBack}
          className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold underline self-start sm:self-auto"
        >
          Exit Admin
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-bold mb-6">
        {[
          { id: 'stats', label: 'Overview & Metrics', icon: Activity },
          { id: 'general', label: 'Founder & Contact', icon: Settings },
          { id: 'donations', label: 'Donation Settings', icon: HeartHandshake },
          { id: 'oauth', label: 'Google OAuth & Keys', icon: Key },
          { id: 'profiles', label: 'Manage Profiles', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Total Digital Cards
              </span>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {profiles.length}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Public Card Views
              </span>
              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {totalViews}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                vCards Downloaded
              </span>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {totalVcards}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Server Privacy Footprint
              </span>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                0 Bytes
              </p>
              <span className="text-[10px] text-slate-400">100% Client-side processing</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Founder info settings */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveSettings} className="max-w-2xl bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
            Founder & Platform Information
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Founder Name
            </label>
            <input
              type="text"
              value={settings.founderName}
              onChange={(e) => setSettings({ ...settings, founderName: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Country of Residence
            </label>
            <input
              type="text"
              value={settings.founderCountry}
              onChange={(e) => setSettings({ ...settings, founderCountry: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Official Contact Email
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              required
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 pt-2">
            <input
              type="checkbox"
              checked={settings.showPhonePublicly}
              onChange={(e) => setSettings({ ...settings, showPhonePublicly: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600"
            />
            <span>Show founder phone number publicly (Disabled by default for privacy)</span>
          </label>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 mt-4"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Settings Saved' : 'Save Changes'}</span>
          </button>
        </form>
      )}

      {/* Tab 3: Donations */}
      {activeTab === 'donations' && (
        <form onSubmit={handleSaveSettings} className="max-w-2xl bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
            Optional Donation Providers
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Configure legitimate links to support platform server and hosting costs.
          </p>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200 mb-4">
            <input
              type="checkbox"
              checked={settings.allowDonations}
              onChange={(e) => setSettings({ ...settings, allowDonations: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600"
            />
            <span>Enable Support / Donation Section on Homepage</span>
          </label>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Buy Me a Coffee URL
            </label>
            <input
              type="url"
              value={settings.buyMeACoffeeUrl}
              onChange={(e) => setSettings({ ...settings, buyMeACoffeeUrl: e.target.value })}
              placeholder="https://buymeacoffee.com/..."
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              PayPal Donate URL
            </label>
            <input
              type="url"
              value={settings.paypalDonateUrl}
              onChange={(e) => setSettings({ ...settings, paypalDonateUrl: e.target.value })}
              placeholder="https://paypal.me/..."
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 mt-4"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Settings Saved' : 'Save Changes'}</span>
          </button>
        </form>
      )}

      {/* Tab 4: Google OAuth & Keys */}
      {activeTab === 'oauth' && (
        <form onSubmit={handleSaveSettings} className="max-w-2xl bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2">
            Google OAuth Credentials
          </h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Configure your official Google Cloud OAuth 2.0 Web Client ID. Once configured, users can sign in with their Google accounts seamlessly.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Google OAuth Client ID
            </label>
            <input
              type="text"
              value={settings.googleOAuthClientId}
              onChange={(e) => setSettings({ ...settings, googleOAuthClientId: e.target.value })}
              placeholder="e.g. 123456789-abcdefg.apps.googleusercontent.com"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Setup Instructions:</span>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open Google Cloud Console ➔ APIs & Services ➔ Credentials.</li>
              <li>Create OAuth Client ID (Application Type: Web Application).</li>
              <li>Add your authorized JavaScript origin and redirect URI.</li>
              <li>Paste the Client ID here or set in <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code>.</li>
            </ol>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 mt-4"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Settings Saved' : 'Save Changes'}</span>
          </button>
        </form>
      )}

      {/* Tab 5: Profiles moderation */}
      {activeTab === 'profiles' && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Moderated Profiles ({profiles.length})
          </h3>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            {profiles.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                    <img src={p.avatarUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {p.fullName} <span className="text-slate-400 font-normal">({p.company})</span>
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      /p/{p.slug} • {p.viewsCount || 0} views • {p.status}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`#/p/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-indigo-600"
                    title="View"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteProfile(p.id, p.fullName)}
                    className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/60 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="Delete / Suspend"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
