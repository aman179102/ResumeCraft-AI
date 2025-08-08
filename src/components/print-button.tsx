
'use client';

import React from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ResumeData } from '@/lib/types';

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
    <Button variant="outline" onClick={handlePrint}>
      <Download className="mr-2" />
      Export to PDF
    </Button>
  );
}
