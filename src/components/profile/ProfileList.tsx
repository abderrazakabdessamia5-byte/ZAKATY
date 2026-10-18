import React, { useState } from 'react';
import { ProfileData, Language } from '../../types';
import { translations } from '../../i18n/translations';
import { getStoredProfiles, deleteProfile } from '../../services/storage';
import {
  Plus,
  Eye,
  Download,
  Share2,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  CreditCard,
  QrCode,
  Radio
} from 'lucide-react';

interface ProfileListProps {
  currentLang: Language;
  onCreateNew: () => void;
  onEdit: (profile: ProfileData) => void;
  onViewPublic: (slug: string) => void;
  onOpenNfc: (url: string) => void;
}

export const ProfileList: React.FC<ProfileListProps> = ({
  currentLang,
  onCreateNew,
  onEdit,
  onViewPublic,
  onOpenNfc,
}) => {
  const t = translations[currentLang];
  const [profiles, setProfiles] = useState<ProfileData[]>(getStoredProfiles());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete profile "${name}"?`)) {
      deleteProfile(id);
      setProfiles(getStoredProfiles());
    }
  };

  const handleCopyLink = (slug: string, id: string) => {
    const origin = window.location.origin;
    const url = `${origin}#/p/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.profile.myProfiles}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build and manage your professional HiHello-style digital business cards with QR and NFC.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.profile.createNew}</span>
        </button>
      </div>

      {profiles.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-white">No profiles yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
            Create your first free digital profile with your photo, contact details, and social links.
          </p>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Create My First Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((p) => {
            const publicUrl = `${window.location.origin}#/p/${p.slug}`;
            return (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                {/* Header preview thumbnail with actual cover photo */}
                <div className="h-28 relative overflow-hidden bg-slate-800 p-4">
                  {p.coverUrl ? (
                    <img
                      src={p.coverUrl}
                      alt="Cover Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                  )}
                  <div className="absolute inset-0 bg-black/40" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10">
                      {p.status}
                    </span>
                    <button
                      onClick={() => handleCopyLink(p.slug, p.id)}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 transition-colors shadow-sm"
                      title="Copy Public Link"
                    >
                      {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Avatar, Logo & Card info */}
                <div className="px-5 pb-5 pt-0 -mt-10 flex-1 flex flex-col justify-between relative z-10">
                  <div>
                    <div className="flex items-end justify-between mb-3">
                      <div className="flex items-end gap-2">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-900 shadow-md bg-white">
                          <img
                            src={p.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                            alt={p.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {p.logoUrl && (
                          <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 p-1 shadow-md border border-white dark:border-slate-800 overflow-hidden flex items-center justify-center shrink-0 mb-0.5" title="Company Logo">
                            <img src={p.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onOpenNfc(publicUrl)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                          title="Write onto NFC Tag"
                        >
                          <Radio className="w-4 h-4 text-indigo-500" />
                        </button>
                        <button
                          onClick={() => onViewPublic(p.slug)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                          title="Open Public Card"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                      {p.fullName}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 truncate">
                      {p.title} • {p.company}
                    </p>

                    <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 mt-1 truncate">
                      /p/{p.slug}
                    </p>
                  </div>

                  {/* Analytics Stats */}
                  <div className="grid grid-cols-3 gap-2 py-3 my-4 border-y border-slate-100 dark:border-slate-800 text-center">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Views</span>
                      <strong className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{p.viewsCount || 0}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">vCards</span>
                      <strong className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{p.vcardDownloadsCount || 0}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Shares</span>
                      <strong className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{p.sharesCount || 0}</strong>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{t.common.edit}</span>
                    </button>
                    <button
                      onClick={() => onViewPublic(p.slug)}
                      className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
                      title="View Card"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.fullName)}
                      className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/60 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
