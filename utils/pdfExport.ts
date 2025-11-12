/**
 * PDF Export Utility
 *
 * Generates professional, LinkedIn-ready portfolio PDFs
 * with charts, visualizations, and clean formatting.
 */

import jsPDF from 'jspdf';

export interface PortfolioData {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  summary: string;
  accomplishments: {
    title: string;
    description: string;
    date: string;
    impact?: string;
    category?: string;
  }[];
  skills?: string[];
  strengths?: string[];
  metrics?: {
    label: string;
    value: string | number;
  }[];
  period?: string;
}

// Color palette - professional and modern
const COLORS = {
  primary: '#8B5CF6', // Purple
  secondary: '#EC4899', // Pink
  gold: '#D4AF37', // Kintsugi gold
  dark: '#1F2937',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  white: '#FFFFFF',
};

/**
 * Generate a professional portfolio PDF
 */
export async function generatePortfolioPDF(data: PortfolioData): Promise<void> {
  // Create PDF in portrait mode, A4 size
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper to add new page if needed
  const checkNewPage = (requiredSpace: number = 30) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Header with gradient background (simulated with rectangle)
  pdf.setFillColor(139, 92, 246); // Purple
  pdf.rect(0, 0, pageWidth, 60, 'F');

  // Name and title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.name, margin, 25);

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.title, margin, 35);

  // Contact info
  if (data.email || data.phone || data.linkedin) {
    pdf.setFontSize(10);
    let contactY = 45;
    if (data.email) {
      pdf.text(data.email, margin, contactY);
      contactY += 5;
    }
    if (data.phone) {
      pdf.text(data.phone, margin, contactY);
      contactY += 5;
    }
    if (data.linkedin) {
      pdf.text(data.linkedin, margin, contactY);
    }
  }

  yPosition = 70;

  // Professional Summary Section
  if (data.summary) {
    pdf.setTextColor(31, 41, 55);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Professional Summary', margin, yPosition);

    yPosition += 8;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(107, 114, 128);

    const summaryLines = pdf.splitTextToSize(data.summary, contentWidth);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 5 + 10;
  }

  // Metrics Section (if provided)
  if (data.metrics && data.metrics.length > 0) {
    checkNewPage(40);

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(31, 41, 55);
    pdf.text('Key Metrics', margin, yPosition);
    yPosition += 10;

    // Display metrics in a grid
    const metricsPerRow = 3;
    const boxWidth = contentWidth / metricsPerRow;
    const boxHeight = 20;

    data.metrics.forEach((metric, index) => {
      const col = index % metricsPerRow;
      const row = Math.floor(index / metricsPerRow);
      const x = margin + (col * boxWidth);
      const y = yPosition + (row * (boxHeight + 5));

      // Box background
      pdf.setFillColor(243, 244, 246);
      pdf.roundedRect(x + 1, y, boxWidth - 2, boxHeight, 2, 2, 'F');

      // Value
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(139, 92, 246);
      const valueText = String(metric.value);
      pdf.text(valueText, x + boxWidth / 2, y + 10, { align: 'center' });

      // Label
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(107, 114, 128);
      const labelLines = pdf.splitTextToSize(metric.label, boxWidth - 4);
      pdf.text(labelLines, x + boxWidth / 2, y + 15, { align: 'center' });
    });

    const rows = Math.ceil(data.metrics.length / metricsPerRow);
    yPosition += rows * (boxHeight + 5) + 10;
  }

  // Key Accomplishments Section
  if (data.accomplishments && data.accomplishments.length > 0) {
    checkNewPage(40);

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(31, 41, 55);
    pdf.text('Key Accomplishments', margin, yPosition);
    yPosition += 10;

    data.accomplishments.forEach((accomplishment, index) => {
      checkNewPage(35);

      // Accomplishment box
      const boxStartY = yPosition;
      pdf.setFillColor(243, 244, 246);

      // Title with gold accent
      pdf.setFillColor(212, 175, 55); // Gold
      pdf.circle(margin + 3, yPosition + 3, 2, 'F');

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55);
      pdf.text(accomplishment.title, margin + 8, yPosition + 5);

      // Date
      if (accomplishment.date) {
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(107, 114, 128);
        const dateWidth = pdf.getTextWidth(accomplishment.date);
        pdf.text(accomplishment.date, pageWidth - margin - dateWidth, yPosition + 5);
      }

      yPosition += 8;

      // Description
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(75, 85, 99);
      const descLines = pdf.splitTextToSize(accomplishment.description, contentWidth - 10);
      pdf.text(descLines, margin + 5, yPosition);
      yPosition += descLines.length * 5;

      // Impact (if provided)
      if (accomplishment.impact) {
        yPosition += 3;
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(139, 92, 246);
        pdf.text('Impact: ', margin + 5, yPosition);

        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(107, 114, 128);
        const impactLines = pdf.splitTextToSize(
          accomplishment.impact,
          contentWidth - 25
        );
        pdf.text(impactLines, margin + 20, yPosition);
        yPosition += impactLines.length * 4.5;
      }

      // Category tag (if provided)
      if (accomplishment.category) {
        yPosition += 3;
        pdf.setFillColor(236, 72, 153); // Pink
        pdf.roundedRect(margin + 5, yPosition - 3, 30, 5, 1, 1, 'F');
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text(accomplishment.category, margin + 7, yPosition);
        yPosition += 5;
      }

      yPosition += 8;
    });
  }

  // Skills Section
  if (data.skills && data.skills.length > 0) {
    checkNewPage(40);

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(31, 41, 55);
    pdf.text('Skills', margin, yPosition);
    yPosition += 10;

    // Display skills as tags
    let xPosition = margin;
    const tagHeight = 8;
    const tagPadding = 3;

    data.skills.forEach((skill) => {
      pdf.setFontSize(9);
      const skillWidth = pdf.getTextWidth(skill) + (tagPadding * 2);

      // Check if tag fits on current line
      if (xPosition + skillWidth > pageWidth - margin) {
        xPosition = margin;
        yPosition += tagHeight + 3;
        checkNewPage(15);
      }

      // Draw tag
      pdf.setFillColor(243, 244, 246);
      pdf.roundedRect(xPosition, yPosition, skillWidth, tagHeight, 2, 2, 'F');

      pdf.setTextColor(107, 114, 128);
      pdf.setFont('helvetica', 'normal');
      pdf.text(skill, xPosition + tagPadding, yPosition + 5.5);

      xPosition += skillWidth + 3;
    });

    yPosition += tagHeight + 15;
  }

  // Strengths Section
  if (data.strengths && data.strengths.length > 0) {
    checkNewPage(40);

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(31, 41, 55);
    pdf.text('Core Strengths', margin, yPosition);
    yPosition += 10;

    data.strengths.forEach((strength) => {
      checkNewPage(10);

      // Bullet point
      pdf.setFillColor(139, 92, 246);
      pdf.circle(margin + 2, yPosition - 1, 1.5, 'F');

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(75, 85, 99);
      const strengthLines = pdf.splitTextToSize(strength, contentWidth - 10);
      pdf.text(strengthLines, margin + 8, yPosition);
      yPosition += strengthLines.length * 5 + 3;
    });

    yPosition += 5;
  }

  // Footer
  const footerY = pageHeight - 15;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(156, 163, 175);
  pdf.text('Generated by Kintsugi - Professional Portfolio', margin, footerY);

  if (data.period) {
    const periodWidth = pdf.getTextWidth(data.period);
    pdf.text(data.period, pageWidth - margin - periodWidth, footerY);
  }

  // Add gold accent line at bottom
  pdf.setDrawColor(212, 175, 55);
  pdf.setLineWidth(0.5);
  pdf.line(margin, footerY + 2, pageWidth - margin, footerY + 2);

  // Save PDF
  const filename = `${data.name.replace(/\s+/g, '_')}_Portfolio_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
}

/**
 * Generate a simplified performance review PDF
 */
export async function generatePerformanceReviewPDF(
  name: string,
  period: string,
  accomplishments: { title: string; description: string; date: string }[],
  summary?: string
): Promise<void> {
  const portfolioData: PortfolioData = {
    name,
    title: 'Performance Review',
    summary: summary || 'Summary of key accomplishments and contributions during this review period.',
    accomplishments,
    period,
  };

  await generatePortfolioPDF(portfolioData);
}

/**
 * Export multiple journal entries as a professional portfolio
 */
export async function exportJournalEntriesAsPDF(
  entries: any[],
  userName: string,
  userTitle: string
): Promise<void> {
  const accomplishments = entries.map(entry => ({
    title: entry.accomplishment || 'Accomplishment',
    description: entry.accomplishment,
    date: new Date(entry.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    category: entry.category,
    impact: entry.impact,
  }));

  const portfolioData: PortfolioData = {
    name: userName,
    title: userTitle,
    summary: `Professional portfolio showcasing ${entries.length} key accomplishments and growth moments.`,
    accomplishments,
    metrics: [
      { label: 'Total Entries', value: entries.length },
      { label: 'Period', value: `${entries.length} days` },
      { label: 'Growth Areas', value: new Set(entries.map(e => e.category)).size },
    ],
    period: `${new Date(entries[0]?.date).toLocaleDateString()} - ${new Date(entries[entries.length - 1]?.date).toLocaleDateString()}`,
  };

  await generatePortfolioPDF(portfolioData);
}
