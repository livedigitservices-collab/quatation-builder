/**
 * Quotation pricing and total calculations
 */

export const calculateServiceAmount = (service) => {
  if (!service) return 0;
  return Math.max(0, Number(service.amount) || 0);
};

export const calculateQuotationTotals = (services = [], discount = {}, taxPercent = 18) => {
  // 1. Calculate sum of manually entered amounts for all active services
  const activeServices = services.filter((s) => s.included !== false);
  
  const subtotal = activeServices.reduce((sum, item) => {
    return sum + (Math.max(0, Number(item.amount) || 0));
  }, 0);

  // 2. Discount calculations
  const discountType = discount.type || 'percentage'; // 'percentage' | 'fixed'
  const rawDiscountValue = Math.max(0, Number(discount.value) || 0);

  let discountAmount = 0;
  if (discountType === 'percentage') {
    const cappedPercent = Math.min(100, rawDiscountValue);
    discountAmount = (subtotal * cappedPercent) / 100;
  } else {
    // Fixed amount discount cannot exceed subtotal
    discountAmount = Math.min(rawDiscountValue, subtotal);
  }

  // 3. Taxable amount
  const taxableAmount = Math.max(0, subtotal - discountAmount);

  // 4. GST calculation
  const safeTaxPercent = Math.max(0, Number(taxPercent) || 0);
  const gstAmount = (taxableAmount * safeTaxPercent) / 100;

  // 5. Grand total
  const grandTotal = taxableAmount + gstAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    discountType,
    discountValue: rawDiscountValue,
    taxableAmount: Math.round(taxableAmount * 100) / 100,
    taxPercent: safeTaxPercent,
    gstAmount: Math.round(gstAmount * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
    itemCount: activeServices.length,
    totalQuantity: activeServices.reduce((acc, curr) => acc + (Math.max(1, parseInt(curr.quantity, 10) || 1)), 0),
  };
};
