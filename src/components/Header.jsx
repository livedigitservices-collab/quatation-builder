import React from 'react';
import { RotateCcw, Download, Eye, Sparkles, Printer, Check } from 'lucide-react';
import { LOGO_BASE64 } from '../data/logoBase64';

export const Header = ({
  onReset,
  onDownloadPdf,
  onPreviewPdf,
  isGeneratingPdf,
  activeItemCount,
  grandTotalFormatted,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Brand & Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {LOGO_BASE64 ? (
                <div className="h-10 sm:h-11 flex items-center">
                  <img
                    src={LOGO_BASE64}
                    alt="Livedigit Logo"
                    className="h-9 sm:h-10 w-auto object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  LD
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  Quotation Builder
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
                  Premium Edition
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Create professional quotations in minutes.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Quick summary chip for mobile/compact viewing */}
            {activeItemCount > 0 && (
              <div className="hidden lg:flex flex-col text-right pr-2">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Total ({activeItemCount} {activeItemCount === 1 ? 'service' : 'services'})
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {grandTotalFormatted}
                </span>
              </div>
            )}

            {/* Reset Button */}
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 active:scale-98 transition-all focus:outline-hidden focus:ring-2 focus:ring-slate-300"
              title="Reset quotation to initial state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset</span>
            </button>

            {/* Preview PDF */}
            <button
              type="button"
              onClick={onPreviewPdf}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 active:scale-98 transition-all focus:outline-hidden focus:ring-2 focus:ring-slate-300"
              title="Preview generated PDF document"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>Preview</span>
            </button>

            {/* Download PDF Button */}
            <button
              type="button"
              onClick={onDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 active:scale-98 transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isGeneratingPdf ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
