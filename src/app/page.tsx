'use client';

import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { initialResumeData, type ResumeData, type Template } from '@/lib/types';
import HeaderControls from '@/components/header-controls';
import ResumeForm from '@/components/resume-form';
import ResumePreview from '@/components/resume-preview';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [template, setTemplate] = useState<Template>('classic');
  const [isMounted, setIsMounted] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => previewRef.current,
    documentTitle: `${resumeData.personalDetails?.name || 'Resume'} - ResumeCraft AI`,
  });

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('resume-data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // You might want to validate parsedData with resumeSchema here
        setResumeData(parsedData);
      }
      const savedTemplate = localStorage.getItem('resume-template');
      if (savedTemplate && ['classic', 'modern', 'minimalist'].includes(savedTemplate)) {
        setTemplate(savedTemplate as Template);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    } finally {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('resume-data', JSON.stringify(resumeData));
      } catch (error) {
        console.error("Failed to save data to localStorage", error);
      }
    }
  }, [resumeData, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('resume-template', template);
    }
  }, [template, isMounted]);

  const handleFormChange = (newData: ResumeData) => {
    setResumeData(newData);
  };

  if (!isMounted) {
    return (
       <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-8 border-b bg-card">
          <Skeleton className="h-8 w-48" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </header>
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
            <Skeleton className="h-full w-full rounded-lg" />
            <Skeleton className="h-full w-full rounded-lg" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderControls
        template={template}
        setTemplate={setTemplate}
        resumeData={resumeData}
        handlePrint={handlePrint}
      />
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 bg-background/80">
        <div className="h-[calc(100vh-4rem)] overflow-y-auto px-4 md:px-8 py-6">
            <ResumeForm initialData={resumeData} onDataChange={handleFormChange} />
        </div>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto px-4 md:px-8 py-6">
            <Card className="p-2 md:p-4 lg:p-8 shadow-2xl h-full">
              <ResumePreview ref={previewRef} resumeData={resumeData} template={template} />
            </Card>
        </div>
      </main>
    </div>
  );
}
