import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatINR, formatDate, numberToWordsINR } from './formatters.js';
import { calculateQuotationTotals, calculateServiceAmount } from './calculations.js';
import { LOGO_BASE64 } from '../data/logoBase64.js';

export const validateQuotationForPdf = (customer, services) => {
  const errors = [];
  if (!customer?.clientName?.trim()) {
    errors.push('Client or Company name is required.');
  }
  const activeServices = services?.filter((s) => s.included !== false) || [];
  if (activeServices.length === 0) {
    errors.push('At least one active service must be included in the quotation.');
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const generateQuotationPDF = async (data) => {
  const {
    company,
    customer,
    quotationMeta,
    services,
    discount,
    taxPercent,
    terms,
    notes,
  } = data;

  const validation = validateQuotationForPdf(customer, services);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(' '));
  }

  const totals = calculateQuotationTotals(services, discount, taxPercent);
  const activeServices = services.filter((s) => s.included !== false);

  // Initialize PDF in A4 format (210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // Top Accent Gradient Bar
  doc.setFillColor(79, 70, 229); // Indigo #4f46e5
  doc.rect(0, 0, pageWidth, 4, 'F');
  doc.setFillColor(236, 72, 153); // Pink accent #ec4899
  doc.rect(0, 4, 30, 1.5, 'F');

  let currentY = 14;

  // 1. Header: Logo & Company Name (Left) + Quotation Title & Date (Right)
  try {
    if (LOGO_BASE64) {
      // Logo dimensions: approx 48mm width, 18mm height
      doc.addImage(LOGO_BASE64, 'PNG', margin, currentY, 48, 19, undefined, 'FAST');
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42);
      doc.text(company.name || 'Livedigit', margin, currentY + 10);
    }
  } catch (err) {
    console.warn('Failed to render logo image, using text fallback', err);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text(company.name || 'Livedigit', margin, currentY + 10);
  }

  // Right Side: Quotation Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // Navy
  doc.text('QUOTATION', pageWidth - margin, currentY + 7, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date: ${formatDate(quotationMeta?.quotationDate)}`, pageWidth - margin, currentY + 14, { align: 'right' });

  currentY += 26;

  // 2. Info Cards: "ISSUED BY" and "PREPARED FOR"
  const colWidth = (contentWidth - 6) / 2;
  const cardHeight = 29;

  // Background cards
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, currentY, colWidth, cardHeight, 2, 2, 'FD');
  doc.roundedRect(margin + colWidth + 6, currentY, colWidth, cardHeight, 2, 2, 'FD');

  // Left card: From
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(79, 70, 229);
  doc.text('ISSUED BY', margin + 4, currentY + 6);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(company.name, margin + 4, currentY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(71, 85, 105);
  doc.text(company.address ? doc.splitTextToSize(company.address, colWidth - 8).slice(0, 2) : '', margin + 4, currentY + 16);
  doc.text(`Email: ${company.email} | Phone: ${company.phone}`, margin + 4, currentY + 24.5);

  // Right card: Bill To
  const rightX = margin + colWidth + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(79, 70, 229);
  doc.text('PREPARED FOR', rightX + 4, currentY + 6);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(customer.clientName || 'Valued Client', rightX + 4, currentY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(71, 85, 105);

  let contactLine = [];
  if (customer.contactPerson) contactLine.push(`Attn: ${customer.contactPerson}`);
  if (customer.phone) contactLine.push(customer.phone);
  if (customer.email) contactLine.push(customer.email);

  if (contactLine.length > 0) {
    doc.text(contactLine.join(' | '), rightX + 4, currentY + 16);
  }

  if (customer.billingAddress) {
    doc.text(doc.splitTextToSize(customer.billingAddress, colWidth - 8).slice(0, 2), rightX + 4, currentY + 21);
  }

  currentY += cardHeight + 6;

  // 3. Table of Services
  const tableData = activeServices.map((service, index) => {
    const planKey = service.selectedPlan || null;
    const planLabel = planKey ? (planKey === 'advanced' ? 'Advanced' : 'Basic') : '—';
    const serviceName = service.name || 'Service';
    const qty = Math.max(1, parseInt(service.quantity, 10) || 1);
    const amount = Math.max(0, Number(service.amount) || 0);

    return [
      (index + 1).toString(),
      serviceName,
      planLabel,
      qty.toString(),
      formatINR(amount, { includeSymbol: false }),
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Service Name', 'Selected Plan', 'Qty', 'Amount (Rs.)']],
    body: tableData,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42], // Slate 900
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
      cellPadding: 3.5,
    },
    styles: {
      fontSize: 8,
      cellPadding: 3.2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
      valign: 'middle',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { cellWidth: 80, fontStyle: 'bold' },
      2: { halign: 'center', cellWidth: 35, fontStyle: 'bold', textColor: [79, 70, 229] },
      3: { halign: 'center', cellWidth: 20 },
      4: { halign: 'right', cellWidth: 35, fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  currentY = doc.lastAutoTable.finalY + 6;

  // Check if we need to add a page for summary + terms
  if (currentY > pageHeight - 75) {
    doc.addPage();
    currentY = 16;
  }

  // 4. Financial Summary + Amount in Words
  const summaryBoxWidth = 84;
  const summaryX = pageWidth - margin - summaryBoxWidth;

  // Left side: Amount in Words & Bank Info
  const leftBlockWidth = contentWidth - summaryBoxWidth - 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('TOTAL AMOUNT IN WORDS:', margin, currentY + 3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  const wordsText = doc.splitTextToSize(numberToWordsINR(totals.grandTotal), leftBlockWidth);
  doc.text(wordsText, margin, currentY + 8);

  // Bank details block
  if (company.bankName) {
    const bankY = currentY + 18;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, bankY, leftBlockWidth, 24, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(79, 70, 229);
    doc.text('BANK & PAYMENT DETAILS', margin + 3, bankY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(51, 65, 85);
    doc.text(`Bank: ${company.bankName}`, margin + 3, bankY + 9);
    doc.text(`Account No: ${company.accountNumber}`, margin + 3, bankY + 13.5);
    doc.text(`IFSC Code: ${company.ifsc} | Branch: ${company.branch}`, margin + 3, bankY + 18);
    doc.text(`UPI ID: livedigit@okhdfcbank`, margin + 3, bankY + 22.5);
  }

  // Right side: Financial Calculation Table (Formatted cleanly as Rs. without unicode symbol artifacts)
  const summaryRows = [
    ['Subtotal', `Rs. ${formatINR(totals.subtotal, { includeSymbol: false })}`],
  ];

  if (totals.discountAmount > 0) {
    const discountLabel = totals.discountType === 'percentage'
      ? `Discount (${totals.discountValue}%)`
      : 'Special Discount';
    summaryRows.push([discountLabel, `-Rs. ${formatINR(totals.discountAmount, { includeSymbol: false })}`]);
    summaryRows.push(['Taxable Amount', `Rs. ${formatINR(totals.taxableAmount, { includeSymbol: false })}`]);
  }

  if (totals.taxPercent > 0) {
    summaryRows.push([`GST / Tax (${totals.taxPercent}%)`, `Rs. ${formatINR(totals.gstAmount, { includeSymbol: false })}`]);
  }

  summaryRows.push(['Grand Total', `Rs. ${formatINR(totals.grandTotal, { includeSymbol: false })}`]);

  autoTable(doc, {
    startY: currentY,
    body: summaryRows,
    margin: { left: summaryX, right: margin },
    theme: 'plain',
    styles: {
      fontSize: 8.5,
      cellPadding: 2.2,
      textColor: [51, 65, 85],
    },
    columnStyles: {
      0: { halign: 'left', fontStyle: 'normal' },
      1: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] },
    },
    didParseCell: (hookData) => {
      // Highlight Grand Total row
      if (hookData.row.index === summaryRows.length - 1) {
        hookData.cell.styles.fillColor = [238, 242, 255]; // Indigo-50
        hookData.cell.styles.textColor = [67, 56, 202]; // Indigo-700
        hookData.cell.styles.fontStyle = 'bold';
        hookData.cell.styles.fontSize = 10;
        hookData.cell.styles.cellPadding = 3;
      }
    },
  });

  currentY = Math.max(doc.lastAutoTable.finalY + 6, currentY + 46);

  // Check page height for Terms and Signatures
  if (currentY > pageHeight - 55) {
    doc.addPage();
    currentY = 16;
  }

  // 5. Terms & Conditions + Notes
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Terms & Conditions:', margin, currentY);

  currentY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);

  const termsList = Array.isArray(terms) ? terms : [terms];
  termsList.forEach((term, idx) => {
    if (term && currentY < pageHeight - 25) {
      doc.text(`${idx + 1}. ${term}`, margin, currentY);
      currentY += 3.6;
    }
  });

  if (notes && currentY < pageHeight - 22) {
    currentY += 1.5;
    doc.setFont('helvetica', 'italic');
    doc.text(`Note: ${notes}`, margin, currentY);
  }

  // Authorized Signatory
  const signX = pageWidth - margin - 45;
  const signY = pageHeight - 24;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.line(signX, signY - 2, signX + 45, signY - 2);
  doc.text(`For ${company.name}`, signX, signY + 2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Authorized Signatory', signX, signY + 6);

  // 6. Header/Footer on each page
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Footer divider
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

    // Footer text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      'This is a computer-generated quotation. Confidential and proprietary to Livedigit Technologies.',
      margin,
      pageHeight - 6
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
  }

  // Clean filename without quotation number
  const safeClient = customer?.clientName
    ? customer.clientName.trim().replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').slice(0, 30)
    : 'Client';
  const filename = `Quotation-${safeClient}.pdf`;

  return {
    doc,
    filename,
    save: () => doc.save(filename),
    toDataUri: () => doc.output('datauristring'),
  };
};
