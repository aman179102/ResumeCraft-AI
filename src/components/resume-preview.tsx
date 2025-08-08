'use client';

import React from 'react';
import type { ResumeData, Template } from '@/lib/types';
import ClassicTemplate from './templates/classic-template';
import ModernTemplate from './templates/modern-template';
import MinimalistTemplate from './templates/minimalist-template';

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: Template;
}

const templates: Record<Template, React.ComponentType<{ resumeData: ResumeData }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimalist: MinimalistTemplate,
};

const ResumePreview = React.forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resumeData, template }, ref) => {
    const TemplateComponent = templates[template] || ClassicTemplate;
    
    return (
      <div ref={ref} className="w-full h-full">
        <TemplateComponent resumeData={resumeData} />
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
