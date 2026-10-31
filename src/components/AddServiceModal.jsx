import React, { useState, useMemo } from 'react';
import { X, Search, Plus, Check, Sparkles, FolderPlus } from 'lucide-react';
import { INITIAL_SERVICES, CATALOG_ADDITIONAL_SERVICES } from '../data/serviceCatalog';
import { formatINR } from '../utils/formatters';

export const AddServiceModal = ({
  isOpen,
  onClose,
  existingServiceIds = [],
  onAddService,
}) => {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'custom'
  const [searchQuery, setSearchQuery] = useState('');

  // Custom service state
  const [customName, setCustomName] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [customPlan, setCustomPlan] = useState(null);
  const [customError, setCustomError] = useState('');

  // Combined predefined catalog
  const fullCatalog = useMemo(() => {
    const seen = new Set();
    const list = [];
    [...INITIAL_SERVICES, ...CATALOG_ADDITIONAL_SERVICES].forEach((item) => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        list.push(item);
      }
    });
    return list;
  }, []);

  // Filtered catalog
  const filteredCatalog = useMemo(() => {
    return fullCatalog.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [fullCatalog, searchQuery]);

  if (!isOpen) return null;

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customName.trim()) {
      setCustomError('Please provide a service name.');
      return;
    }

    const amt = parseFloat(customAmount);
    const validAmount = isNaN(amt) ? '' : Math.max(0, amt);

    const newService = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      selectedPlan: customPlan || null,
      quantity: 0,
      amount: validAmount,
    };

    onAddService(newService);
    // Reset form
    setCustomName('');
    setCustomAmount('');
    setCustomPlan(null);
    setCustomError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add Service to Quotation</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a service from the catalog or add a custom service.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'border-indigo-600 text-indigo-600 bg-white/60 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Service Catalog ({fullCatalog.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'custom'
                ? 'border-indigo-600 text-indigo-600 bg-white/60 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Custom Service</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'catalog' ? (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search service name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 focus:outline-hidden"
                />
              </div>

              {/* Service List */}
              <div className="space-y-2.5 pt-1">
                {filteredCatalog.map((item) => {
                  const isAlreadyAdded = existingServiceIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isAlreadyAdded
                          ? 'border-slate-200 bg-slate-50/60 opacity-75'
                          : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'
                      }`}
                    >
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm">
                          {item.name}
                        </h4>
                      </div>

                      <div>
                        {isAlreadyAdded ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="w-3.5 h-3.5" /> Added
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onAddService({
                                ...item,
                                selectedPlan: item.defaultPlan || null,
                                quantity: item.defaultQty !== undefined ? item.defaultQty : 0,
                                amount: item.defaultAmount !== undefined ? item.defaultAmount : '',
                              });
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredCatalog.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No services found matching your search.
                </div>
              )}
            </div>
          ) : (
            /* Custom Service Form */
            <form onSubmit={handleAddCustom} className="space-y-4">
              {customError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {customError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Service Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mobile Application Development"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Initial Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full text-sm font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Initial Selected Plan
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCustomPlan(customPlan === 'basic' ? null : 'basic')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      customPlan === 'basic'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    Basic
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomPlan(customPlan === 'advanced' ? null : 'advanced')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      customPlan === 'advanced'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    Advanced
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-150">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Quotation</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-150 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>You can adjust amounts or remove services anytime.</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
