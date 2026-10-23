import React, { useState } from 'react';
import { Building2, Calendar, Mail, Phone, MapPin, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export const CustomerDetails = ({
  customer,
  setCustomer,
  quotationMeta,
  setQuotationMeta,
  company,
  setCompany,
  errors = {},
}) => {
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);

  const handleCustomerChange = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleMetaChange = (field, value) => {
    setQuotationMeta((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Customer Information (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                Client & Customer Information
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              * Required for Quotation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Client / Company Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Client / Company Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. AcroPulse Technologies Pvt. Ltd."
                  value={customer.clientName || ''}
                  onChange={(e) => handleCustomerChange('clientName', e.target.value)}
                  className={`w-full text-sm px-3.5 py-2.5 rounded-xl border ${
                    errors.clientName
                      ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                  } focus:outline-hidden focus:ring-3 transition-all`}
                />
              </div>
              {errors.clientName && (
                <p className="text-xs text-rose-500 mt-1">{errors.clientName}</p>
              )}
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contact Person
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Vikramaditya Sharma"
                  value={customer.contactPerson || ''}
                  onChange={(e) => handleCustomerChange('contactPerson', e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 focus:outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Email Address (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="e.g. vikram@acropulse.io (Optional)"
                  value={customer.email || ''}
                  onChange={(e) => handleCustomerChange('email', e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 focus:outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="e.g. +91 98490 12345"
                  value={customer.phone || ''}
                  onChange={(e) => handleCustomerChange('phone', e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 focus:outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Billing Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Billing Address / Location
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Tower B, 6th Floor, Sector 62, Noida, UP 201301"
                value={customer.billingAddress || ''}
                onChange={(e) => handleCustomerChange('billingAddress', e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 focus:outline-hidden transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Quotation Date & Issuer (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 lg:border-l lg:border-slate-100 lg:pl-6">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  Quotation Date
                </h2>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                INR (₹)
              </span>
            </div>

            <div className="mt-3.5">
              {/* Quotation Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Date of Issue
                </label>
                <input
                  type="date"
                  value={quotationMeta.quotationDate || ''}
                  onChange={(e) => handleMetaChange('quotationDate', e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Business Provider Card (Collapsible) */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-700">
                  Issued By: <span className="text-slate-900">{company.name}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowCompanyDetails(!showCompanyDetails)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                {showCompanyDetails ? 'Hide' : 'Edit Company Info'}
                {showCompanyDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {showCompanyDetails && (
              <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-500 font-medium">Company Name</label>
                  <input
                    type="text"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium">Email</label>
                  <input
                    type="text"
                    value={company.email}
                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium">Phone</label>
                  <input
                    type="text"
                    value={company.phone}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-500 font-medium">Registered Address</label>
                  <input
                    type="text"
                    value={company.address}
                    onChange={(e) => setCompany({ ...company, address: e.target.value })}
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
