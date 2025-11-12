'use client';

import { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { generatePortfolioPDF, PortfolioData } from '@/utils/pdfExport';

interface PDFExportButtonProps {
  data: PortfolioData;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export default function PDFExportButton({
  data,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
}: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await generatePortfolioPDF(data);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Variant styles
  const variantStyles = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg',
    secondary: 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg',
    outline: 'border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleExport}
      disabled={isExporting}
      className={`
        inline-flex items-center gap-2 rounded-lg font-semibold
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {isExporting ? (
        <>
          <Loader2 className={`${iconSize[size]} animate-spin`} />
          <span>Generating PDF...</span>
        </>
      ) : exportSuccess ? (
        <>
          <FileText className={iconSize[size]} />
          <span>PDF Downloaded!</span>
        </>
      ) : (
        <>
          <Download className={iconSize[size]} />
          <span>{children || 'Export as PDF'}</span>
        </>
      )}
    </motion.button>
  );
}
