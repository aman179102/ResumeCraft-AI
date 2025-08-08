import { z } from 'zod';

export const personalDetailsSchema = z.object({
  name: z.string().default(''),
  email: z.string().default(''),
  phone: z.string().default(''),
  location: z.string().default(''),
  website: z.string().default(''),
  linkedin: z.string().default(''),
});

export const workExperienceSchema = z.object({
  jobTitle: z.string().default(''),
  company: z.string().default(''),
  location: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  description: z.string().default(''),
});

export const educationSchema = z.object({
  degree: z.string().default(''),
  school: z.string().default(''),
  location: z.string().default(''),
  graduationDate: z.string().default(''),
});

export const skillSchema = z.object({
  name: z.string().default(''),
});

export const certificationSchema = z.object({
  name: z.string().default(''),
  issuingOrg: z.string().default(''),
  date: z.string().default(''),
});

export const projectSchema = z.object({
  name: z.string().default(''),
  description: z.string().default(''),
  link: z.string().default(''),
});

export const resumeSchema = z.object({
  personalDetails: personalDetailsSchema.default({}),
  summary: z.string().default(''),
  workExperience: z.array(workExperienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  projects: z.array(projectSchema).default([]),
});

export const initialResumeData = resumeSchema.parse({});

export type ResumeData = z.infer<typeof resumeSchema>;
export type Template = 'classic' | 'modern' | 'minimalist';
