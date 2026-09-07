import React, { useRef, useState } from 'react';
import { ProceduralTreeRenderer } from '../tree/ProceduralTreeRenderer';
import { SPECIES_CATALOG } from '../tree/speciesData';
import { translations, type AppLanguage } from '../../utils/i18n';
import { Download, Share2, X } from 'lucide-react';
import type { TreeLifecycleStage } from '../../db';

interface ShareSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  speciesId?: string;
  lifecycleStage?: TreeLifecycleStage;
  daysTended?: number;
  journalCount?: number;
  ringsCount?: number;
  lang?: AppLanguage;
}

export const ShareSnapshotModal: React.FC<ShareSnapshotModalProps> = ({
  isOpen,
  onClose,
  speciesId = 'noble_pine',
  lifecycleStage = 'mature',
  daysTended = 14,
  journalCount = 6,
  ringsCount = 2,
  lang = 'en',
}) => {
  const t = translations[lang] || translations.en;
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const species = SPECIES_CATALOG[speciesId] || SPECIES_CATALOG.noble_pine;
  const title = lang === 'ckb' ? species.kurdishName : species.name;

  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      // Create offscreen canvas for crisp 9:16 export (1080x1920 scaled to 540x960)
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw Serene Gradient Background
      const grad = ctx.createLinearGradient(0, 0, 0, 1920);
      grad.addColorStop(0, '#F6F3EC');
      grad.addColorStop(0.5, '#EDE8DE');
      grad.addColorStop(1, '#E2DCD0');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Header Brand
      ctx.fillStyle = '#6B8E23';
      ctx.font = 'bold 34px serif';
      ctx.textAlign = 'center';
      ctx.fillText(t.appName.toUpperCase(), 540, 220);

      ctx.fillStyle = '#57534E';
      ctx.font = '32px sans-serif';
      ctx.fillText(t.appSubtitle, 540, 275);

      // Tree Title & Species
      ctx.fillStyle = '#1C1917';
      ctx.font = 'bold 64px serif';
      ctx.fillText(title, 540, 420);

      ctx.fillStyle = '#78716C';
      ctx.font = 'italic 34px serif';
      ctx.fillText(species.scientificName, 540, 480);

      // Draw Botanical Tree using SVG data URL
      const svgEl = cardRef.current?.querySelector('svg');
      if (svgEl) {
        const svgData = new XMLSerializer().serializeToString(svgEl);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        const img = new Image();
        await new Promise((resolve) => {
          img.onload = () => {
            ctx.drawImage(img, 140, 560, 800, 800);
            URL.revokeObjectURL(blobURL);
            resolve(true);
          };
          img.src = blobURL;
        });
      }

      // Stats Pill Bar
      ctx.fillStyle = '#FFFFFF';
      ctx.roundRect(140, 1440, 800, 160, 40);
      ctx.fill();
      ctx.strokeStyle = '#D6D3D1';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#292524';
      ctx.font = 'bold 44px serif';
      ctx.fillText(`${daysTended} ${t.tree.daysTended}`, 320, 1540);
      ctx.fillText(`${journalCount} ${t.tree.roots}`, 760, 1540);

      // Story Footer
      ctx.fillStyle = '#78716C';
      ctx.font = '32px serif';
      ctx.fillText(t.share.footerQuote, 540, 1780);

      // Trigger download
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `tree-planner-story-${species.id}.png`;
      link.href = pngUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image snapshot:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.appName,
          text: `${title} — ${t.share.footerQuote}`,
          url: window.location.href,
        });
      } catch {
        // User dismissed
      }
    } else {
      handleDownloadImage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md animate-soft-fade-up select-none">
      <div className="w-full max-w-sm bg-white dark:bg-night-surface rounded-3xl p-5 shadow-calm-lg border border-stone-200/80 dark:border-night-border space-y-4 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-night-border">
          <div>
            <span className="text-[11px] font-medium tracking-wider uppercase text-sage-600">
              {t.share.title}
            </span>
            <h3 className="font-serif text-base font-medium text-stone-800 dark:text-stone-100">
              {t.share.storyCard}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 9:16 Aspect Ratio Story Card Preview */}
        <div
          ref={cardRef}
          className="w-full aspect-[9/16] rounded-2xl bg-gradient-to-b from-parchment-subtle via-stone-100 to-parchment-deep dark:from-night-surface dark:via-night-card dark:to-stone-950 p-6 flex flex-col justify-between items-center text-center shadow-inner border border-stone-200/60 dark:border-night-border relative overflow-hidden"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-medium tracking-widest uppercase text-sage-600 dark:text-sage-400">
              {t.appName}
            </span>
            <h4 className="font-serif text-lg font-medium text-stone-800 dark:text-stone-100">
              {title}
            </h4>
            <p className="text-[11px] font-serif italic text-stone-400 dark:text-stone-400">
              {species.scientificName}
            </p>
          </div>

          {/* Botanical Tree Graphic */}
          <div className="w-48 h-48 sm:w-52 sm:h-52 relative flex items-center justify-center animate-tree-breeze">
            <ProceduralTreeRenderer
              speciesId={speciesId}
              stage={lifecycleStage}
              journalCount={journalCount}
            />
          </div>

          {/* Story Badge Stats */}
          <div className="w-full space-y-3">
            <div className="grid grid-cols-3 gap-2 bg-white/70 dark:bg-night-surface/70 backdrop-blur-xs p-2.5 rounded-2xl border border-stone-200/50 dark:border-night-border text-xs">
              <div>
                <span className="text-[10px] text-stone-400 block">{t.tree.daysTended}</span>
                <span className="font-serif font-medium text-stone-800 dark:text-stone-200">
                  {daysTended}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block">{t.tree.roots}</span>
                <span className="font-serif font-medium text-earth-700 dark:text-earth-400">
                  {journalCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block">{t.tree.rings}</span>
                <span className="font-serif font-medium text-sage-700 dark:text-sage-400">
                  {ringsCount}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-stone-400 font-serif italic">
              {t.share.footerQuote}
            </p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-stone-100 dark:bg-night-card hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-serif text-xs transition-colors shadow-xs active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.share.downloadPng}</span>
          </button>
          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-sage-600 hover:bg-sage-700 active:scale-95 text-white font-serif text-xs transition-all shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{t.share.shareNative}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
