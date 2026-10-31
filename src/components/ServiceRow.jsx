import React from 'react';
import { Minus, Plus, Trash2, CheckCircle2 } from 'lucide-react';

/**
 * Desktop & Tablet Table Row (strictly returns <tr> for <tbody>)
 */
export const ServiceRow = ({
  service,
  index,
  onUpdatePlan,
  onUpdateQuantity,
  onUpdateAmount,
  onRemove,
}) => {
  const selectedPlan = service.selectedPlan || null;
  const qty = service.quantity !== undefined && service.quantity !== ''
    ? Math.max(0, parseInt(service.quantity, 10) || 0)
    : 0;

  const handleQtyChange = (e) => {
    const raw = e.target.value;
    if (raw === '') {
      onUpdateQuantity(service.id, '');
    } else {
      const val = parseInt(raw, 10);
      if (!isNaN(val)) {
        onUpdateQuantity(service.id, Math.max(0, val));
      }
    }
  };

  const handleDecrement = () => {
    const currentQty = service.quantity !== undefined && service.quantity !== ''
      ? parseInt(service.quantity, 10) || 0
      : 0;
    if (currentQty > 0) {
      onUpdateQuantity(service.id, currentQty - 1);
    }
  };

  const handleIncrement = () => {
    const currentQty = service.quantity !== undefined && service.quantity !== ''
      ? parseInt(service.quantity, 10) || 0
      : 0;
    onUpdateQuantity(service.id, currentQty + 1);
  };

  const handlePlanToggle = (planName) => {
    if (selectedPlan === planName) {
      onUpdatePlan(service.id, null);
    } else {
      onUpdatePlan(service.id, planName);
    }
  };

  const handleAmountChange = (e) => {
    const raw = e.target.value;
    if (raw === '') {
      onUpdateAmount(service.id, '');
    } else {
      const parsed = parseFloat(raw);
      onUpdateAmount(service.id, isNaN(parsed) ? 0 : Math.max(0, parsed));
    }
  };

  return (
    <tr className="group hover:bg-slate-50/70 border-b border-slate-150 transition-colors">
      {/* 1. Services Column: Display only the main service name */}
      <td className="py-4 pl-4 pr-3 align-middle">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold shrink-0">
            {index + 1}
          </span>
          <span className="font-semibold text-slate-900 text-sm">
            {service.name}
          </span>
        </div>
      </td>

      {/* 2. Quantity Column */}
      <td className="py-4 px-3 align-middle text-center w-36">
        <div className="inline-flex items-center rounded-lg border border-slate-250 bg-white shadow-2xs p-0.5">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={qty <= 0}
            className="w-7 h-7 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <input
            type="number"
            min="0"
            value={service.quantity !== undefined ? service.quantity : 0}
            onChange={handleQtyChange}
            className="w-10 text-center text-sm font-semibold text-slate-800 bg-transparent focus:outline-hidden [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={handleIncrement}
            className="w-7 h-7 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            title="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>

      {/* 3. Basic Plan Column (Select / Deselect Option without Price) */}
      <td className="py-4 px-3 align-middle w-40 text-center">
        <button
          type="button"
          onClick={() => handlePlanToggle('basic')}
          className={`w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-semibold transition-all ${
            selectedPlan === 'basic'
              ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-2xs ring-1 ring-indigo-600/30'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
              selectedPlan === 'basic'
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-300 bg-white'
            }`}
          >
            {selectedPlan === 'basic' && <CheckCircle2 className="w-3 h-3" />}
          </div>
          <span>Basic</span>
        </button>
      </td>

      {/* 4. Advanced Plan Column (Select / Deselect Option without Price) */}
      <td className="py-4 px-3 align-middle w-40 text-center">
        <button
          type="button"
          onClick={() => handlePlanToggle('advanced')}
          className={`w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-semibold transition-all ${
            selectedPlan === 'advanced'
              ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-2xs ring-1 ring-indigo-600/30'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
              selectedPlan === 'advanced'
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-300 bg-white'
            }`}
          >
            {selectedPlan === 'advanced' && <CheckCircle2 className="w-3 h-3" />}
          </div>
          <span>Advanced</span>
        </button>
      </td>

      {/* 5. Amount Column: Editable text field to manually enter price */}
      <td className="py-4 px-3 align-middle w-44">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none">
            ₹
          </span>
          <input
            type="number"
            min="0"
            step="100"
            value={service.amount !== undefined ? service.amount : ''}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="w-full pl-7 pr-3 py-2 text-sm font-bold text-right text-slate-900 bg-white border border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 focus:outline-hidden transition-all shadow-2xs"
          />
        </div>
      </td>

      {/* Actions (Delete) */}
      <td className="py-4 pl-2 pr-4 align-middle text-right w-12">
        <button
          type="button"
          onClick={() => onRemove(service.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title={`Remove ${service.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

/**
 * Mobile Card (strictly returns <div> for mobile container)
 */
export const ServiceCard = ({
  service,
  index,
  onUpdatePlan,
  onUpdateQuantity,
  onUpdateAmount,
  onRemove,
}) => {
  const selectedPlan = service.selectedPlan || null;
  const qty = service.quantity !== undefined && service.quantity !== ''
    ? Math.max(0, parseInt(service.quantity, 10) || 0)
    : 0;

  const handleQtyChange = (e) => {
    const raw = e.target.value;
    if (raw === '') {
      onUpdateQuantity(service.id, '');
    } else {
      const val = parseInt(raw, 10);
      if (!isNaN(val)) {
        onUpdateQuantity(service.id, Math.max(0, val));
      }
    }
  };

  const handleDecrement = () => {
    const currentQty = service.quantity !== undefined && service.quantity !== ''
      ? parseInt(service.quantity, 10) || 0
      : 0;
    if (currentQty > 0) {
      onUpdateQuantity(service.id, currentQty - 1);
    }
  };

  const handleIncrement = () => {
    const currentQty = service.quantity !== undefined && service.quantity !== ''
      ? parseInt(service.quantity, 10) || 0
      : 0;
    onUpdateQuantity(service.id, currentQty + 1);
  };

  const handlePlanToggle = (planName) => {
    if (selectedPlan === planName) {
      onUpdatePlan(service.id, null);
    } else {
      onUpdatePlan(service.id, planName);
    }
  };

  const handleAmountChange = (e) => {
    const raw = e.target.value;
    if (raw === '') {
      onUpdateAmount(service.id, '');
    } else {
      const parsed = parseFloat(raw);
      onUpdateAmount(service.id, isNaN(parsed) ? 0 : Math.max(0, parsed));
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5 mb-3">
      {/* Header: Service Name + Delete */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold shrink-0">
            {index + 1}
          </span>
          <h3 className="font-semibold text-slate-900 text-sm">
            {service.name}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onRemove(service.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
          title="Remove service"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Plan Selectors (Selectable without Prices) */}
      <div className="grid grid-cols-2 gap-2">
        {/* Basic */}
        <button
          type="button"
          onClick={() => handlePlanToggle('basic')}
          className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
            selectedPlan === 'basic'
              ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-1 ring-indigo-600'
              : 'border-slate-200 bg-white text-slate-700'
          }`}
        >
          <div
            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
              selectedPlan === 'basic' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
            }`}
          >
            {selectedPlan === 'basic' && <CheckCircle2 className="w-2.5 h-2.5" />}
          </div>
          <span>Basic</span>
        </button>

        {/* Advanced */}
        <button
          type="button"
          onClick={() => handlePlanToggle('advanced')}
          className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
            selectedPlan === 'advanced'
              ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-1 ring-indigo-600'
              : 'border-slate-200 bg-white text-slate-700'
          }`}
        >
          <div
            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
              selectedPlan === 'advanced' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
            }`}
          >
            {selectedPlan === 'advanced' && <CheckCircle2 className="w-2.5 h-2.5" />}
          </div>
          <span>Advanced</span>
        </button>
      </div>

      {/* Quantity and Editable Amount Row */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium">Qty:</span>
          <div className="inline-flex items-center rounded-lg border border-slate-250 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={qty <= 0}
              className="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-xs font-bold text-slate-800">
              {qty}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              className="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:bg-slate-200"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex-1 max-w-[150px]">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none">
              ₹
            </span>
            <input
              type="number"
              min="0"
              step="100"
              value={service.amount !== undefined ? service.amount : ''}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="w-full pl-6 pr-2.5 py-1.5 text-xs font-bold text-right text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:border-indigo-500 focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
