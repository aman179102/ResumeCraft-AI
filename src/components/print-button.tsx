
'use client';

import React from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download } from 'lucide-react';
import type { ResumeData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface PrintButtonProps {
  previewRef: React.RefObject<HTMLDivElement>;
  resumeData: ResumeData;
}

export default function PrintButton({ previewRef, resumeData }: PrintButtonProps) {
  const handlePrint = useReactToPrint({
    content: () => previewRef.current,
    documentTitle: `${resumeData.personalDetails?.name || 'Resume'} - ResumeCraft AI`,
  });

  return (
    <button
      onClick={handlePrint}
      className={cn(buttonVariants({ variant: "outline" }))}
    >
      <Download className="mr-2" />
      Export to PDF
    </button>
  );
}
