import React, { useState } from 'react';
import {
  Calculator,
  Percent,
  Receipt,
  Download,
  Eye,
  Copy,
  Check,
  Tag,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { formatINR, numberToWordsINR } from '../utils/formatters';

export const PriceSummary = ({
  totals,
  discount,
  setDiscount,
  taxPercent,
  setTaxPercent,
  onDownloadPdf,
  onPreviewPdf,
  isGeneratingPdf,
  customerName,
}) => {
  const [copied, setCopied] = useState(false);

  const handleDiscountTypeChange = (type) => {
    setDiscount((prev) => ({
      ...prev,
      type,
      // Adjust default value if switching
      value: type === 'percentage' && prev.value > 100 ? 10 : prev.value,
    }));
  };

  const handleDiscountValueChange = (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val) || val < 0) {
      setDiscount((prev) => ({ ...prev, value: 0 }));
    } else {
      // If percentage, cap at 100
      if (discount.type === 'percentage') {
        setDiscount((prev) => ({ ...prev, value: Math.min(100, val) }));
      } else {
        setDiscount((prev) => ({ ...prev, value: val }));
      }
    }
  };

  const handleCopySummary = () => {
    const text = `*QUOTATION SUMMARY*\n` +
      `Prepared For: ${customerName || 'Valued Client'}\n\n` +
      `• Subtotal: ${formatINR(totals.subtotal)}\n` +
      (totals.discountAmount > 0
        ? `• Discount (${totals.discountType === 'percentage' ? `${totals.discountValue}%` : 'Fixed'}): -${formatINR(totals.discountAmount)}\n`
        : '') +
      `• Taxable Amount: ${formatINR(totals.taxableAmount)}\n` +
      (totals.taxPercent > 0
        ? `• GST (${totals.taxPercent}%): ${formatINR(totals.gstAmount)}\n`
        : '') +
      `------------------------\n` +
      `*Grand Total: ${formatINR(totals.grandTotal)}*\n` +
      `Amount in words: ${numberToWordsINR(totals.grandTotal)}\n\n` +
      `Generated via Livedigit Quotation Builder.`;

    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const taxPresets = [0, 5, 12, 18, 28];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 lg:sticky lg:top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-150">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Quotation Summary
            </h2>
            <p className="text-[11px] text-slate-500">
              Automatic real-time calculation
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopySummary}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          title="Copy text breakdown to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-4 space-y-4 text-sm">
        {/* 1. Subtotal */}
        <div className="flex items-center justify-between text-slate-700">
          <span className="font-medium text-slate-600">Subtotal</span>
          <span className="font-semibold text-slate-900 text-base">
            {formatINR(totals.subtotal)}
          </span>
        </div>

        {/* 2. Discount Controls */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Tag className="w-3.5 h-3.5 text-indigo-600" />
              <span>Discount</span>
            </div>

            {/* Toggle Percentage vs Fixed */}
            <div className="inline-flex rounded-lg border border-slate-250 bg-white p-0.5 text-xs">
              <button
                type="button"
                onClick={() => handleDiscountTypeChange('percentage')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  discount.type === 'percentage'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                % Percent
              </button>
              <button
                type="button"
                onClick={() => handleDiscountTypeChange('fixed')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  discount.type === 'fixed'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ₹ Fixed
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                max={discount.type === 'percentage' ? '100' : totals.subtotal}
                step={discount.type === 'percentage' ? '1' : '100'}
                value={discount.value === 0 ? '' : discount.value}
                placeholder="0"
                onChange={handleDiscountValueChange}
                className="w-full pl-3 pr-8 py-2 text-sm font-semibold rounded-lg border border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                {discount.type === 'percentage' ? '%' : '₹'}
              </span>
            </div>

            <div className="text-right min-w-[90px]">
              <span className="text-[10px] text-slate-400 block">Deduction</span>
              <span className={`text-xs font-bold ${totals.discountAmount > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                {totals.discountAmount > 0 ? `-${formatINR(totals.discountAmount)}` : '₹0.00'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Taxable Amount (Shown when discount is applied) */}
        {totals.discountAmount > 0 && (
          <div className="flex items-center justify-between text-slate-600 text-xs px-1">
            <span>Taxable Amount</span>
            <span className="font-semibold text-slate-800">
              {formatINR(totals.taxableAmount)}
            </span>
          </div>
        )}

        {/* 4. GST / Tax Rate Selector */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-indigo-600" />
              <span>GST / Statutory Tax</span>
            </span>
            <span className="text-xs font-bold text-slate-900">
              +{formatINR(totals.gstAmount)}
            </span>
          </div>

          {/* Quick GST Preset Buttons */}
          <div className="flex items-center gap-1.5">
            {taxPresets.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setTaxPercent(pct)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  taxPercent === pct
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/30'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 my-2" />

        {/* 5. Grand Total Box */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md">
          <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
            <span className="uppercase tracking-wider font-semibold text-[11px]">
              Final Total Payable
            </span>
            <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30 font-medium">
              Incl. GST
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {formatINR(totals.grandTotal)}
          </div>

          {/* Amount in Words */}
          <div className="mt-2.5 pt-2 border-t border-white/10 text-[11px] text-slate-300 leading-snug">
            <span className="text-slate-400 block text-[9px] uppercase tracking-wider mb-0.5">
              In Words:
            </span>
            <span className="italic font-medium text-slate-200">
              {numberToWordsINR(totals.grandTotal)}
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf || totals.itemCount === 0}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isGeneratingPdf ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                <span>Download Official PDF</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onPreviewPdf}
            disabled={totals.itemCount === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>Interactive Live Preview</span>
          </button>
        </div>

        {/* Assurance footnote */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Compliant with Indian GST & Billing Standards</span>
        </div>
      </div>
    </div>
  );
};
