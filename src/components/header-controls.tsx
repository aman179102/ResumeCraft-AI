
'use client';

import React from 'react';
import { FileText, Bot, Download } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { ResumeData, Template } from '@/lib/types';

interface HeaderControlsProps {
  template: Template;
  setTemplate: (template: Template) => void;
  resumeData: ResumeData;
  onPdfExport: () => void;
}

export default function HeaderControls({
  template,
  setTemplate,
  resumeData,
  onPdfExport,
}: HeaderControlsProps) {

  const formatText = (data: ResumeData): string => {
    let content = '';
    const { personalDetails, summary, workExperience, education, skills, certifications, projects } = data;

    if (personalDetails?.name) content += `${personalDetails.name.toUpperCase()}\n`;
    if (personalDetails?.email || personalDetails?.phone || personalDetails?.location || personalDetails?.linkedin || personalDetails?.website) {
        content += [personalDetails.email, personalDetails.phone, personalDetails.location, personalDetails.linkedin, personalDetails.website].filter(Boolean).join(' | ') + '\n';
    }
    content += '\n';

    if (summary) {
        content += 'SUMMARY\n' + '-'.repeat(30) + '\n' + summary + '\n\n';
    }

    if (workExperience && workExperience.length > 0) {
        content += 'WORK EXPERIENCE\n' + '-'.repeat(30) + '\n';
        workExperience.forEach(exp => {
            content += `${exp.jobTitle.toUpperCase()} | ${exp.company}\n`;
            content += `${exp.startDate} - ${exp.endDate} | ${exp.location}\n`;
            content += exp.description + '\n\n';
        });
    }
    
    if (education && education.length > 0) {
        content += 'EDUCATION\n' + '-'.repeat(30) + '\n';
        education.forEach(edu => {
            content += `${edu.degree} | ${edu.school}\n`;
            content += `${edu.graduationDate} | ${edu.location}\n\n`;
        });
    }

    if (skills && skills.length > 0) {
        content += 'SKILLS\n' + '-'.repeat(30) + '\n';
        content += skills.map(skill => skill.name).join(', ') + '\n\n';
    }

    if (projects && projects.length > 0) {
        content += 'PROJECTS\n' + '-'.repeat(30) + '\n';
        projects.forEach(proj => {
            content += `${proj.name.toUpperCase()}\n`;
            if (proj.link) content += `${proj.link}\n`;
            content += proj.description + '\n\n';
        });
    }

    if (certifications && certifications.length > 0) {
        content += 'CERTIFICATIONS\n' + '-'.repeat(30) + '\n';
        certifications.forEach(cert => {
            content += `${cert.name} | ${cert.issuingOrg} | ${cert.date}\n`;
        });
        content += '\n';
    }

    return content;
  };

  const handleTxtExport = () => {
    const textContent = formatText(resumeData);
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.personalDetails?.name || 'resume'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <header className="sticky top-0 z-10 flex items-center h-16 px-4 md:px-8 border-b bg-card shadow-sm">
      <div className="flex items-center gap-2">
        <Bot className="h-7 w-7 text-primary" />
        <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">
          ResumeCraft AI
        </h1>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2 md:gap-4">
        <Select value={template} onValueChange={(value) => setTemplate(value as Template)}>
          <SelectTrigger className="w-[120px] md:w-[150px]">
            <SelectValue placeholder="Template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="classic">Classic</SelectItem>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="minimalist">Minimalist</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={onPdfExport} variant="outline">
            <Download className="mr-2" />
            Export to PDF
        </Button>

        <Button onClick={handleTxtExport}>
            <FileText className="mr-2" />
            Export to TXT
        </Button>
      </div>
    </header>
  );
}
