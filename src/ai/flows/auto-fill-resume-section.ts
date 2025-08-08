'use server';
/**
 * @fileOverview This file defines a Genkit flow for auto-filling resume sections with AI-generated content.
 *
 * - autoFillResumeSection - A function that handles the auto-filling process for a given resume section.
 * - AutoFillResumeSectionInput - The input type for the autoFillResumeSection function.
 * - AutoFillResumeSectionOutput - The return type for the autoFillResumeSection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoFillResumeSectionInputSchema = z.object({
  sectionType: z.enum(['Summary', 'Education', 'WorkExperience', 'Skills', 'Certifications', 'Projects']).describe('The type of resume section to auto-fill.'),
  existingContent: z.string().describe('The user-provided existing content for the section.'),
  userDetails: z.string().describe('A summary of the user details to provide context for content generation.'),
});
export type AutoFillResumeSectionInput = z.infer<typeof AutoFillResumeSectionInputSchema>;

const AutoFillResumeSectionOutputSchema = z.object({
  autoFilledContent: z.string().describe('The AI-generated content for the resume section.'),
});
export type AutoFillResumeSectionOutput = z.infer<typeof AutoFillResumeSectionOutputSchema>;

export async function autoFillResumeSection(input: AutoFillResumeSectionInput): Promise<AutoFillResumeSectionOutput> {
  return autoFillResumeSectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoFillResumeSectionPrompt',
  input: {schema: AutoFillResumeSectionInputSchema},
  output: {schema: AutoFillResumeSectionOutputSchema},
  prompt: `You are an AI resume assistant. You will be provided with a section type, existing content, and user details. Based on this information, you will generate professional, keyword-optimized, and ATS-friendly content for the specified resume section.

Section Type: {{{sectionType}}}
Existing Content: {{{existingContent}}}
User Details: {{{userDetails}}}

Please generate the auto-filled content:
`,
});

const autoFillResumeSectionFlow = ai.defineFlow(
  {
    name: 'autoFillResumeSectionFlow',
    inputSchema: AutoFillResumeSectionInputSchema,
    outputSchema: AutoFillResumeSectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
