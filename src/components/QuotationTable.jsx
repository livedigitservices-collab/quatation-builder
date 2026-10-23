import React from 'react';
import { Plus, Layers, PackagePlus, Sparkles } from 'lucide-react';
import { ServiceRow, ServiceCard } from './ServiceRow';

export const QuotationTable = ({
  services = [],
  onUpdatePlan,
  onUpdateQuantity,
  onUpdateAmount,
  onRemoveService,
  onOpenAddModal,
  onRestoreDefaults,
}) => {
  const activeCount = services.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden mb-6">
      {/* Table Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Services & Pricing
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {activeCount} {activeCount === 1 ? 'service' : 'services'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select tier (Basic or Advanced) and enter service amounts.
            </p>
          </div>
        </div>

        {/* Action Button: Add Service */}
        <div className="flex items-center gap-2">
          {activeCount < 23 && (
            <button
              type="button"
              onClick={onRestoreDefaults}
              className="text-xs text-slate-600 hover:text-indigo-600 px-3 py-2 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Reset to Defaults
            </button>
          )}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-98 shadow-2xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {activeCount === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4">
            <PackagePlus className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            No Services Selected
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Your quotation currently has no services. Add services from the catalog or restore the standard service pack.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Browse Catalog</span>
            </button>
            <button
              type="button"
              onClick={onRestoreDefaults}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all"
            >
              <span>Restore Default Services</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop & Tablet Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th scope="col" className="py-3 pl-4 pr-3">
                    Services
                  </th>
                  <th scope="col" className="py-3 px-3 text-center w-36">
                    Quantity
                  </th>
                  <th scope="col" className="py-3 px-3 text-center w-40">
                    Basic Plan
                  </th>
                  <th scope="col" className="py-3 px-3 text-center w-40">
                    Advanced Plan
                  </th>
                  <th scope="col" className="py-3 px-3 text-right w-44">
                    Amount (₹)
                  </th>
                  <th scope="col" className="py-3 pl-2 pr-4 text-right w-12">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {services.map((service, index) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    index={index}
                    onUpdatePlan={onUpdatePlan}
                    onUpdateQuantity={onUpdateQuantity}
                    onUpdateAmount={onUpdateAmount}
                    onRemove={onRemoveService}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden p-3 bg-slate-50/60 divide-y divide-slate-100">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                onUpdatePlan={onUpdatePlan}
                onUpdateQuantity={onUpdateQuantity}
                onUpdateAmount={onUpdateAmount}
                onRemove={onRemoveService}
              />
            ))}
          </div>
        </>
      )}

      {/* Bottom helper strip */}
      {activeCount > 0 && (
        <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Amounts can be manually edited. Total is calculated automatically.</span>
          </div>
          <span className="font-medium text-slate-600">
            {activeCount} active {activeCount === 1 ? 'service' : 'services'} included
          </span>
        </div>
      )}
    </div>
  );
};
