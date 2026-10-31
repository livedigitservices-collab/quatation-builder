import React, { useState } from 'react';
import { FileCheck, Plus, Trash2, Edit3, MessageSquare, ChevronDown, ChevronUp, Landmark } from 'lucide-react';

export const TermsAndNotes = ({
  terms,
  setTerms,
  notes,
  setNotes,
  company,
  setCompany,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTerm, setNewTerm] = useState('');

  const handleAddTerm = (e) => {
    e.preventDefault();
    if (newTerm.trim()) {
      setTerms([...terms, newTerm.trim()]);
      setNewTerm('');
    }
  };

  const handleRemoveTerm = (index) => {
    setTerms(terms.filter((_, i) => i !== index));
  };

  const handleUpdateTerm = (index, value) => {
    const updated = [...terms];
    updated[index] = value;
    setTerms(updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-150">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Terms & Conditions, Notes & Payment Info
            </h2>
            <p className="text-xs text-slate-500">
              Custom terms, bank details, and remarks included in the generated PDF.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <span>{isExpanded ? 'Collapse' : 'Customize'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick Summary View when collapsed */}
      {!isExpanded ? (
        <div className="mt-3.5 space-y-2 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <span className="font-semibold text-slate-700 shrink-0">Terms:</span>
            <span className="line-clamp-1 text-slate-500">
              {terms.length} clauses configured (Payment schedule, validity, GST rates, revisions).
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold text-slate-700 shrink-0">Notes:</span>
            <span className="line-clamp-1 text-slate-500 italic">
              {notes ? `"${notes}"` : 'None'}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold text-slate-700 shrink-0">Bank Account:</span>
            <span className="text-slate-500">
              {company.bankName} • A/C: {company.accountNumber} • IFSC: {company.ifsc}
            </span>
          </div>
        </div>
      ) : (
        /* Detailed Edit View */
        <div className="mt-5 space-y-6">
          {/* Terms Section */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Quotation Terms ({terms.length})
            </label>
            <div className="space-y-2">
              {terms.map((term, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 w-5 text-right">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => handleUpdateTerm(idx, e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTerm(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete clause"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Term Form */}
            <form onSubmit={handleAddTerm} className="flex items-center gap-2 mt-3">
              <input
                type="text"
                placeholder="Add a new custom condition or scope note..."
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Clause</span>
              </button>
            </form>
          </div>

          {/* Notes Section */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Client Remarks / Closing Note
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden resize-none"
              placeholder="Custom remarks or closing thank-you note..."
            />
          </div>

          {/* Bank & Remittance Details */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2 mb-3">
              <Landmark className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Remittance & Bank Information (Printed on PDF)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={company.bankName || ''}
                  onChange={(e) => setCompany({ ...company, bankName: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={company.accountNumber || ''}
                  onChange={(e) => setCompany({ ...company, accountNumber: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={company.ifsc || ''}
                  onChange={(e) => setCompany({ ...company, ifsc: e.target.value.toUpperCase() })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  value={company.branch || ''}
                  onChange={(e) => setCompany({ ...company, branch: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
