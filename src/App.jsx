import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { CustomerDetails } from './components/CustomerDetails';
import { QuotationTable } from './components/QuotationTable';
import { PriceSummary } from './components/PriceSummary';
import { TermsAndNotes } from './components/TermsAndNotes';
import { AddServiceModal } from './components/AddServiceModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { PdfPreviewModal } from './components/PdfPreviewModal';
import { Toast } from './components/Toast';
import {
  INITIAL_SERVICES,
  DEFAULT_COMPANY_DETAILS,
  DEFAULT_CUSTOMER_DETAILS,
  DEFAULT_QUOTATION_META,
  DEFAULT_TERMS_AND_CONDITIONS,
  DEFAULT_NOTES,
} from './data/serviceCatalog';
import { calculateQuotationTotals } from './utils/calculations';
import { formatINR } from './utils/formatters';
import { generateQuotationPDF, validateQuotationForPdf } from './utils/pdfGenerator';
import { Download, Layers, ShieldCheck, HelpCircle } from 'lucide-react';

const STORAGE_KEY = 'livedigit_quotation_v5';

export default function App() {
  // 1. Initial State Initialization from LocalStorage or Defaults
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_services`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((s) => ({
          ...s,
          quantity: s.quantity !== undefined ? s.quantity : (s.defaultQty !== undefined ? s.defaultQty : 0),
          amount: s.amount !== undefined ? s.amount : (s.defaultAmount !== undefined ? s.defaultAmount : ''),
        }));
      }
    } catch (e) {
      console.warn('Could not read saved services from localStorage', e);
    }
    return INITIAL_SERVICES.map((s) => ({
      ...s,
      selectedPlan: s.defaultPlan || null,
      quantity: s.defaultQty !== undefined ? s.defaultQty : 0,
      amount: s.defaultAmount !== undefined ? s.defaultAmount : '',
    }));
  });

  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_customer`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read customer from localStorage', e);
    }
    return DEFAULT_CUSTOMER_DETAILS;
  });

  const [quotationMeta, setQuotationMeta] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_meta`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read quotationMeta from localStorage', e);
    }
    return DEFAULT_QUOTATION_META;
  });

  const [company, setCompany] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_company`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read company from localStorage', e);
    }
    return DEFAULT_COMPANY_DETAILS;
  });

  const [discount, setDiscount] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_discount`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read discount from localStorage', e);
    }
    return { type: 'percentage', value: 0 };
  });

  const [taxPercent, setTaxPercent] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tax`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read tax from localStorage', e);
    }
    return 18;
  });

  const [terms, setTerms] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_terms`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read terms from localStorage', e);
    }
    return DEFAULT_TERMS_AND_CONDITIONS;
  });

  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notes`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read notes from localStorage', e);
    }
    return DEFAULT_NOTES;
  });

  // Modal and Interaction States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewPdfUri, setPreviewPdfUri] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // 2. Persist to LocalStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_services`, JSON.stringify(services));
      localStorage.setItem(`${STORAGE_KEY}_customer`, JSON.stringify(customer));
      localStorage.setItem(`${STORAGE_KEY}_meta`, JSON.stringify(quotationMeta));
      localStorage.setItem(`${STORAGE_KEY}_company`, JSON.stringify(company));
      localStorage.setItem(`${STORAGE_KEY}_discount`, JSON.stringify(discount));
      localStorage.setItem(`${STORAGE_KEY}_tax`, JSON.stringify(taxPercent));
      localStorage.setItem(`${STORAGE_KEY}_terms`, JSON.stringify(terms));
      localStorage.setItem(`${STORAGE_KEY}_notes`, JSON.stringify(notes));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [services, customer, quotationMeta, company, discount, taxPercent, terms, notes]);

  // 3. Dynamic Totals Calculation (Single Source of Truth)
  const totals = useMemo(() => {
    return calculateQuotationTotals(services, discount, taxPercent);
  }, [services, discount, taxPercent]);

  // 4. Handlers for Services
  const handleUpdatePlan = useCallback((serviceId, plan) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, selectedPlan: plan } : s))
    );
  }, []);

  const handleUpdateQuantity = useCallback((serviceId, newQty) => {
    if (newQty === '') {
      setServices((prev) =>
        prev.map((s) => (s.id === serviceId ? { ...s, quantity: '' } : s))
      );
      return;
    }
    const safeQty = Math.max(0, parseInt(newQty, 10) || 0);
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, quantity: safeQty } : s))
    );
  }, []);

  const handleUpdateAmount = useCallback((serviceId, newAmount) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, amount: newAmount } : s))
    );
  }, []);

  const handleRemoveService = useCallback((serviceId) => {
    setServices((prev) => {
      const item = prev.find((s) => s.id === serviceId);
      const filtered = prev.filter((s) => s.id !== serviceId);
      if (item) {
        showToast(`Removed "${item.name}" from quotation.`, 'info');
      }
      return filtered;
    });
  }, [showToast]);

  const handleAddService = useCallback((newService) => {
    setServices((prev) => {
      // Check if already in list
      if (prev.some((s) => s.id === newService.id)) {
        showToast(`"${newService.name}" is already in the quotation.`, 'info');
        return prev;
      }
      showToast(`Added "${newService.name}" to quotation.`, 'success');
      return [...prev, newService];
    });
  }, [showToast]);

  const handleRestoreDefaults = useCallback(() => {
    setServices(
      INITIAL_SERVICES.map((s) => ({
        ...s,
        selectedPlan: s.defaultPlan || null,
        quantity: s.defaultQty !== undefined ? s.defaultQty : 0,
        amount: s.defaultAmount !== undefined ? s.defaultAmount : '',
      }))
    );
    showToast('Restored standard service catalog.', 'success');
  }, [showToast]);

  // 5. Reset All State Confirmation
  const handleConfirmReset = useCallback(() => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_services`);
      localStorage.removeItem(`${STORAGE_KEY}_customer`);
      localStorage.removeItem(`${STORAGE_KEY}_meta`);
      localStorage.removeItem(`${STORAGE_KEY}_company`);
      localStorage.removeItem(`${STORAGE_KEY}_discount`);
      localStorage.removeItem(`${STORAGE_KEY}_tax`);
      localStorage.removeItem(`${STORAGE_KEY}_terms`);
      localStorage.removeItem(`${STORAGE_KEY}_notes`);
    } catch (e) {
      console.warn('LocalStorage clear failed', e);
    }

    setServices(
      INITIAL_SERVICES.map((s) => ({
        ...s,
        selectedPlan: s.defaultPlan || null,
        quantity: s.defaultQty !== undefined ? s.defaultQty : 0,
        amount: s.defaultAmount !== undefined ? s.defaultAmount : '',
      }))
    );
    setCustomer(DEFAULT_CUSTOMER_DETAILS);
    setQuotationMeta({
      ...DEFAULT_QUOTATION_META,
      quotationDate: new Date().toISOString().split('T')[0],
    });
    setCompany(DEFAULT_COMPANY_DETAILS);
    setDiscount({ type: 'percentage', value: 0 });
    setTaxPercent(18);
    setTerms(DEFAULT_TERMS_AND_CONDITIONS);
    setNotes(DEFAULT_NOTES);
    setFormErrors({});
    showToast('Quotation has been reset to defaults.', 'info');
  }, [showToast]);

  // 6. PDF Generation & Download Handler
  const handleDownloadPdf = async () => {
    // Validate
    const validation = validateQuotationForPdf(customer, services);
    if (!validation.isValid) {
      const errors = {};
      if (!customer?.clientName?.trim()) {
        errors.clientName = 'Client or Company Name is required.';
      }
      setFormErrors(errors);
      showToast(validation.errors.join(' '), 'error');
      return;
    }

    setFormErrors({});
    setIsGeneratingPdf(true);

    try {
      const pdf = await generateQuotationPDF({
        company,
        customer,
        quotationMeta,
        services,
        discount,
        taxPercent,
        terms,
        notes,
      });

      pdf.save();

      // Confetti burst on successful quotation generation!
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Safe fallback if canvas is not supported
      }

      showToast(`Quotation ${pdf.filename} downloaded successfully!`, 'success');
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast(err.message || 'Failed to generate PDF quotation.', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 7. PDF Live Preview Handler
  const handlePreviewPdf = async () => {
    const validation = validateQuotationForPdf(customer, services);
    if (!validation.isValid) {
      showToast(validation.errors.join(' '), 'error');
      return;
    }

    try {
      const pdf = await generateQuotationPDF({
        company,
        customer,
        quotationMeta,
        services,
        discount,
        taxPercent,
        terms,
        notes,
      });

      setPreviewPdfUri(pdf.toDataUri());
      setIsPreviewModalOpen(true);
    } catch (err) {
      console.error('PDF preview error:', err);
      showToast(err.message || 'Failed to preview PDF.', 'error');
    }
  };

  const existingServiceIds = useMemo(() => services.map((s) => s.id), [services]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Header */}
      <Header
        onReset={() => setIsResetModalOpen(true)}
        onDownloadPdf={handleDownloadPdf}
        onPreviewPdf={handlePreviewPdf}
        isGeneratingPdf={isGeneratingPdf}
        activeItemCount={totals.itemCount}
        grandTotalFormatted={formatINR(totals.grandTotal)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Customer & Quotation Reference Card */}
        <CustomerDetails
          customer={customer}
          setCustomer={setCustomer}
          quotationMeta={quotationMeta}
          setQuotationMeta={setQuotationMeta}
          company={company}
          setCompany={setCompany}
          errors={formErrors}
        />

        {/* 2-Column Responsive Layout: Table on Left, Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Main Services Area (8 cols on desktop) */}
          <div className="lg:col-span-8 space-y-6">
            <QuotationTable
              services={services}
              onUpdatePlan={handleUpdatePlan}
              onUpdateQuantity={handleUpdateQuantity}
              onUpdateAmount={handleUpdateAmount}
              onRemoveService={handleRemoveService}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onRestoreDefaults={handleRestoreDefaults}
            />

            {/* Terms, Conditions and Notes */}
            <TermsAndNotes
              terms={terms}
              setTerms={setTerms}
              notes={notes}
              setNotes={setNotes}
              company={company}
              setCompany={setCompany}
            />
          </div>

          {/* Pricing Summary Sidebar (4 cols on desktop) */}
          <div className="lg:col-span-4">
            <PriceSummary
              totals={totals}
              discount={discount}
              setDiscount={setDiscount}
              taxPercent={taxPercent}
              setTaxPercent={setTaxPercent}
              onDownloadPdf={handleDownloadPdf}
              onPreviewPdf={handlePreviewPdf}
              isGeneratingPdf={isGeneratingPdf}
              customerName={customer.clientName}
            />
          </div>

        </div>
      </main>

      {/* Mobile Sticky Bottom Floating Action Bar */}
      <div className="lg:hidden sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">
            Grand Total ({totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="text-base font-extrabold text-slate-900">
            {formatINR(totals.grandTotal)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf || totals.itemCount === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm active:scale-98 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Livedigit Quotation Builder</span>
            <span>•</span>
            <span>Empowering business proposals with speed & precision.</span>
          </div>
          <div className="text-slate-400">
            Auto-saves locally • Indian Rupee (₹) Pricing • GST Compliant
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        existingServiceIds={existingServiceIds}
        onAddService={handleAddService}
      />

      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

      <PdfPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        pdfDataUri={previewPdfUri}
        filename={`Quotation-${customer?.clientName ? customer.clientName.trim().replace(/[^a-zA-Z0-9]/g, '_') : 'Client'}.pdf`}
        onDownload={handleDownloadPdf}
      />

      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
