import React from 'react';
import { X, Download, Printer, ExternalLink } from 'lucide-react';

export const PdfPreviewModal = ({
  isOpen,
  onClose,
  pdfDataUri,
  filename,
  onDownload,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">
              PDF Quotation Preview
            </h3>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              {filename}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Iframe Viewer */}
        <div className="flex-1 bg-slate-100 p-2 sm:p-4 overflow-hidden">
          {pdfDataUri ? (
            <iframe
              src={pdfDataUri}
              title="Quotation Preview"
              className="w-full h-full rounded-xl border border-slate-200 bg-white shadow-xs"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Generating PDF preview...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
