/**
 * Currency and date formatting utilities
 */

export const formatINR = (amount, options = {}) => {
  const num = Number(amount) || 0;
  const {
    includeSymbol = true,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(num);

  return includeSymbol ? `₹${formatted}` : formatted;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Converts numeric amount to Indian English words
 * Example: 125000 -> "Rupees One Lakh Twenty-Five Thousand Only"
 */
export const numberToWordsINR = (num) => {
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ',
    'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ',
    'Seventeen ', 'Eighteen ', 'Nineteen ',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n) => {
    if (n === 0) return '';
    let str = '';
    if (n > 99) {
      str += a[Math.floor(n / 100)] + 'Hundred ';
      n %= 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + (n % 10 ? '-' + a[n % 10].trim() : '') + ' ';
    } else if (n > 0) {
      str += a[n];
    }
    return str;
  };

  const amount = Math.floor(Math.abs(Number(num) || 0));
  if (amount === 0) return 'Rupees Zero Only';

  const crore = Math.floor(amount / 10000000);
  const lakh = Math.floor((amount % 10000000) / 100000);
  const thousand = Math.floor((amount % 100000) / 1000);
  const hundred = amount % 1000;

  let result = 'Rupees ';
  if (crore > 0) result += inWords(crore) + 'Crore ';
  if (lakh > 0) result += inWords(lakh) + 'Lakh ';
  if (thousand > 0) result += inWords(thousand) + 'Thousand ';
  if (hundred > 0) result += inWords(hundred);

  return result.trim() + ' Only';
};
