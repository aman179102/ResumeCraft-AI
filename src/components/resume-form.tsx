'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import type { ResumeData } from '@/lib/types';
import {
  resumeSchema,
  personalDetailsSchema,
  workExperienceSchema,
  educationSchema,
  skillSchema,
  projectSchema,
  certificationSchema
} from '@/lib/types';
import { autoFillResumeSection } from '@/ai/flows/auto-fill-resume-section';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Sparkles, Trash2, User, Briefcase, GraduationCap, Lightbulb, Award, Wrench, FolderGit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ResumeFormProps {
  initialData: ResumeData;
  onDataChange: (data: ResumeData) => void;
}

type LoadingState = {
    [key: string]: boolean | { [index: number]: boolean };
};

export default function ResumeForm({ initialData, onDataChange }: ResumeFormProps) {
  const { toast } = useToast();
  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: initialData,
  });

  const watchedData = useWatch({ control: form.control });
  useEffect(() => {
    onDataChange(watchedData as ResumeData);
  }, [watchedData, onDataChange]);

  const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({ control: form.control, name: 'workExperience' });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control: form.control, name: 'education' });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control: form.control, name: 'skills' });
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({ control: form.control, name: 'projects' });
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({ control: form.control, name: 'certifications' });
  
  const [loading, setLoading] = useState<LoadingState>({});

  const handleAIAutofill = async (section: string, index: number = -1) => {
    const path = index > -1 ? `${section}.${index}` : section;
    setLoading(prev => ({ ...prev, [path]: true }));

    try {
        const formData = form.getValues();
        const userDetails = `The user's name is ${formData.personalDetails?.name}. Skills listed include ${formData.skills?.map(s => s.name).join(', ')}.`;
        
        let sectionType: any = 'Summary'; // default
        let existingContent = '';
        if (section === 'summary') {
            sectionType = 'Summary';
            existingContent = formData.summary || '';
        } else if (section === 'workExperience') {
            sectionType = 'WorkExperience';
            existingContent = JSON.stringify(formData.workExperience?.[index]);
        }
        
        const response = await autoFillResumeSection({ sectionType, existingContent, userDetails });

        if (section === 'summary') {
            form.setValue('summary', response.autoFilledContent);
        } else if (section === 'workExperience') {
            try {
                const parsedContent = JSON.parse(response.autoFilledContent);
                form.setValue(`workExperience.${index}.description`, parsedContent.description || formData.workExperience?.[index]?.description);
                form.setValue(`workExperience.${index}.jobTitle`, parsedContent.jobTitle || formData.workExperience?.[index]?.jobTitle);
            } catch (e) {
                form.setValue(`workExperience.${index}.description`, response.autoFilledContent);
            }
        }

        toast({ title: 'Success', description: `${sectionType} section updated by AI.` });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'AI Error',
            description: `Could not generate content for ${section}.`,
        });
    } finally {
        setLoading(prev => ({ ...prev, [path]: false }));
    }
  };

  const sectionIconClass = "mr-2 h-5 w-5 text-primary";
  const aiButton = (section: string, index: number = -1) => (
    <Button type="button" size="sm" variant="ghost" className="gap-2 text-primary hover:text-primary" onClick={() => handleAIAutofill(section, index)} disabled={!!loading[`${section}${index > -1 ? `.${index}`: ''}`]}>
        {loading[`${section}${index > -1 ? `.${index}` : ''}`] ? <Loader2 className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
        Auto-Fill with AI
    </Button>
  );

  return (
    <Form {...form}>
      <form className="space-y-6">
        <Accordion type="multiple" defaultValue={['personal', 'summary']} className="w-full space-y-4">
          <AccordionItem value="personal" className="border-none">
            <Card>
                <AccordionTrigger className="p-6">
                    <CardHeader className="p-0 flex-row items-center">
                        <User className={sectionIconClass} />
                        <CardTitle>Personal Details</CardTitle>
                    </CardHeader>
                </AccordionTrigger>
                <AccordionContent asChild>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="personalDetails.name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} placeholder="John Doe" /></FormControl></FormItem> )} />
                        <FormField control={form.control} name="personalDetails.email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} placeholder="john.doe@email.com" /></FormControl></FormItem> )} />
                        <FormField control={form.control} name="personalDetails.phone" render={({ field }) => ( <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} placeholder="(123) 456-7890" /></FormControl></FormItem> )} />
                        <FormField control={form.control} name="personalDetails.location" render={({ field }) => ( <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} placeholder="City, Country" /></FormControl></FormItem> )} />
                        <FormField control={form.control} name="personalDetails.linkedin" render={({ field }) => ( <FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input {...field} placeholder="linkedin.com/in/..." /></FormControl></FormItem> )} />
                        <FormField control={form.control} name="personalDetails.website" render={({ field }) => ( <FormItem><FormLabel>Website/Portfolio</FormLabel><FormControl><Input {...field} placeholder="yourportfolio.com" /></FormControl></FormItem> )} />
                    </CardContent>
                </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="summary" className="border-none">
             <Card>
                <AccordionTrigger className="p-6">
                    <CardHeader className="p-0 flex-row items-center">
                        <Lightbulb className={sectionIconClass} />
                        <CardTitle>Professional Summary</CardTitle>
                    </CardHeader>
                </AccordionTrigger>
                <AccordionContent asChild>
                    <CardContent>
                        <FormField control={form.control} name="summary" render={({ field }) => ( <FormItem><FormLabel>Summary</FormLabel><FormControl><Textarea {...field} rows={5} placeholder="A brief summary of your career achievements and goals..." /></FormControl></FormItem> )} />
                        <div className="flex justify-end mt-2">{aiButton('summary')}</div>
                    </CardContent>
                </AccordionContent>
             </Card>
          </AccordionItem>

          <AccordionItem value="experience" className="border-none">
            <Card>
                <AccordionTrigger className="p-6">
                    <CardHeader className="p-0 flex-row items-center">
                        <Briefcase className={sectionIconClass} />
                        <CardTitle>Work Experience</CardTitle>
                    </CardHeader>
                </AccordionTrigger>
                <AccordionContent asChild>
                    <CardContent className="space-y-4">
                        {workFields.map((field, index) => (
                            <Card key={field.id} className="p-4 space-y-4 relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name={`workExperience.${index}.jobTitle`} render={({ field }) => ( <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input {...field} placeholder="Software Engineer" /></FormControl></FormItem> )} />
                                <FormField control={form.control} name={`workExperience.${index}.company`} render={({ field }) => ( <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} placeholder="Tech Corp" /></FormControl></FormItem> )} />
                                <FormField control={form.control} name={`workExperience.${index}.location`} render={({ field }) => ( <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} placeholder="City, Country" /></FormControl></FormItem> )} />
                                <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name={`workExperience.${index}.startDate`} render={({ field }) => ( <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input {...field} placeholder="Jan 2022" /></FormControl></FormItem> )} />
                                <FormField control={form.control} name={`workExperience.${index}.endDate`} render={({ field }) => ( <FormItem><FormLabel>End Date</FormLabel><FormControl><Input {...field} placeholder="Present" /></FormControl></FormItem> )} />
                                </div>
                                </div>
                                <FormField control={form.control} name={`workExperience.${index}.description`} render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={4} placeholder="Describe your responsibilities and achievements..." /></FormControl></FormItem> )} />
                                <div className="flex justify-between items-center">
                                    {aiButton('workExperience', index)}
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeWork(index)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </Card>
                        ))}
                        <Button type="button" variant="outline" className="w-full" onClick={() => appendWork(workExperienceSchema.parse({}))}>
                            <PlusCircle className="mr-2 h-4 w-4"/> Add Experience
                        </Button>
                    </CardContent>
                </AccordionContent>
            </Card>
          </AccordionItem>
          
          {/* Education */}
          <AccordionItem value="education" className="border-none">
            <Card>
                <AccordionTrigger className="p-6">
                    <CardHeader className="p-0 flex-row items-center">
                        <GraduationCap className={sectionIconClass} />
                        <CardTitle>Education</CardTitle>
                    </CardHeader>
                </AccordionTrigger>
                <AccordionContent asChild>
                    <CardContent className="space-y-4">
                        {eduFields.map((field, index) => (
                            <Card key={field.id} className="p-4 space-y-4 relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => ( <FormItem><FormLabel>Degree</FormLabel><FormControl><Input {...field} placeholder="B.Sc. in Computer Science" /></FormControl></FormItem> )} />
                                <FormField control={form.control} name={`education.${index}.school`} render={({ field }) => ( <FormItem><FormLabel>School/University</FormLabel><FormControl><Input {...field} placeholder="University of Technology" /></FormControl></FormItem> )} />
                                <FormField control={form.control} name={`education.${index}.location`} render={({ field }) => ( <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} placeholder="City, Country" /></FormControl></FormItem> )} />
                                <FormField control={form.control} name={`education.${index}.graduationDate`} render={({ field }) => ( <FormItem><FormLabel>Graduation Date</FormLabel><FormControl><Input {...field} placeholder="May 2021" /></FormControl></FormItem> )} />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeEdu(index)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </Card>
                        ))}
                        <Button type="button" variant="outline" className="w-full" onClick={() => appendEdu(educationSchema.parse({}))}>
                           <PlusCircle className="mr-2 h-4 w-4"/> Add Education
                        </Button>
                    </CardContent>
                </AccordionContent>
            </Card>
          </AccordionItem>

          {/* Skills */}
          <AccordionItem value="skills" className="border-none">
            <Card>
                <AccordionTrigger className="p-6">
                    <CardHeader className="p-0 flex-row items-center">
                        <Wrench className={sectionIconClass} />
                        <CardTitle>Skills</CardTitle>
                    </CardHeader>
                </AccordionTrigger>
                <AccordionContent asChild>
                    <CardContent className="space-y-4">
                        {skillFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <FormField control={form.control} name={`skills.${index}.name`} render={({ field }) => ( <FormItem className="flex-1"><FormControl><Input {...field} placeholder="e.g., React" /></FormControl></FormItem> )} />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeSkill(index)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" className="w-full" onClick={() => appendSkill(skillSchema.parse({}))}>
                            <PlusCircle className="mr-2 h-4 w-4"/> Add Skill
                        </Button>
                    </CardContent>
                </AccordionContent>
            </Card>
          </AccordionItem>

          {/* Projects */}
          <AccordionItem value="projects" className="border-none">
             <Card>
                <AccordionTrigger className="p-6">
                    <CardHeader className="p-0 flex-row items-center">
                        <FolderGit className={sectionIconClass} />
                        <CardTitle>Projects</CardTitle>
                    </CardHeader>
                </AccordionTrigger>
                <AccordionContent asChild>
                    <CardContent className="space-y-4">
                        {projectFields.map((field, index) => (
                             <Card key={field.id} className="p-4 space-y-4 relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name={`projects.${index}.name`} render={({ field }) => ( <FormItem><FormLabel>Project Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem> )} />
                                <FormField control={form.control} name={`projects.${index}.link`} render={({ field }) => ( <FormItem><FormLabel>Project Link</FormLabel><FormControl><Input {...field} /></FormControl></FormItem> )} />
                                </div>
                                <FormField control={form.control} name={`projects.${index}.description`} render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl></FormItem> )} />
                                <div className="flex justify-end">
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeProject(index)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </Card>
                        ))}
                        <Button type="button" variant="outline" className="w-full" onClick={() => appendProject(projectSchema.parse({}))}>
                           <PlusCircle className="mr-2 h-4 w-4"/> Add Project
                        </Button>
                    </CardContent>
                </AccordionContent>
             </Card>
          </AccordionItem>

          {/* Certifications */}
          <AccordionItem value="certifications" className="border-none">
             <Card>
                <AccordionTrigger className="p-6">
                    <CardHeader className="p-0 flex-row items-center">
                        <Award className={sectionIconClass} />
                        <CardTitle>Certifications</CardTitle>
                    </CardHeader>
                </AccordionTrigger>
                <AccordionContent asChild>
                    <CardContent className="space-y-4">
                         {certFields.map((field, index) => (
                             <Card key={field.id} className="p-4 space-y-4 relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name={`certifications.${index}.name`} render={({ field }) => ( <FormItem><FormLabel>Certification Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem> )} />
                                <FormField control={form.control} name={`certifications.${index}.issuingOrg`} render={({ field }) => ( <FormItem><FormLabel>Issuing Organization</FormLabel><FormControl><Input {...field} /></FormControl></FormItem> )} />
                                <FormField control={form.control} name={`certifications.${index}.date`} render={({ field }) => ( <FormItem><FormLabel>Date Issued</FormLabel><FormControl><Input {...field} placeholder="Jun 2023" /></FormControl></FormItem> )} />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="button" variant="destructive" size="icon" onClick={() => removeCert(index)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </Card>
                        ))}
                        <Button type="button" variant="outline" className="w-full" onClick={() => appendCert(certificationSchema.parse({}))}>
                           <PlusCircle className="mr-2 h-4 w-4"/> Add Certification
                        </Button>
                    </CardContent>
                </AccordionContent>
             </Card>
          </AccordionItem>

        </Accordion>
      </form>
    </Form>
  );
}
