'use server';

/**
 * @fileOverview Generates a short, beautiful story about a software project.
 *
 * - generateProjectStory - A function that generates a project story.
 * - GenerateProjectStoryInput - The input type for the generateProjectStory function.
 * - GenerateProjectStoryOutput - The return type for the generateProjectStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectStoryInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  projectType: z.string().describe('The type of project (e.g., web app, mobile app, library).'),
  userRole: z.string().describe('The user\'s role in the project (e.g., solo developer, team lead, designer).'),
  keyChallenge: z.string().describe('The single biggest challenge or struggle faced during development.'),
  keySolution: z.string().describe('The breakthrough or solution that overcame the challenge.'),
  targetAudience: z.string().describe('The intended audience for the story (e.g., other developers, potential users, investors).'),
});

export type GenerateProjectStoryInput = z.infer<typeof GenerateProjectStoryInputSchema>;

const GenerateProjectStoryOutputSchema = z.object({
  story: z.string().describe('A short, beautifully written story about the project, formatted in Markdown.'),
});

export type GenerateProjectStoryOutput = z.infer<typeof GenerateProjectStoryOutputSchema>;

export async function generateProjectStory(input: GenerateProjectStoryInput): Promise<GenerateProjectStoryOutput> {
  return generateProjectStoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectStoryPrompt',
  input: {schema: GenerateProjectStoryInputSchema},
  output: {schema: GenerateProjectStoryOutputSchema},
  prompt: `You are a master storyteller for the tech world. Your task is to write a short, beautiful, and inspiring story about a project, focusing on the human element of creation, struggle, and triumph.

Your audience is {{{targetAudience}}}.

Please weave the following details into a compelling narrative of about 3-4 paragraphs. Use Markdown for formatting (e.g., headings, bold text, italics).

- Project Name: {{{projectName}}}
- Project Type: {{{projectType}}}
- Protagonist's Role: {{{userRole}}}
- The Great Obstacle: The story's central conflict is the challenge: "{{{keyChallenge}}}"
- The Breakthrough Moment: The climax of the story is the solution: "{{{keySolution}}}"

Craft a narrative that is less of a technical report and more of an emotional journey. Start by setting the scene, introduce the challenge as a formidable foe, describe the struggle, and celebrate the moment of breakthrough. Conclude with a reflection on the project's meaning or the lessons learned.`,
});

const generateProjectStoryFlow = ai.defineFlow(
  {
    name: 'generateProjectStoryFlow',
    inputSchema: GenerateProjectStoryInputSchema,
    outputSchema: GenerateProjectStoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
