// src/ai/flows/generate-story-prompt.ts
'use server';

/**
 * @fileOverview Generates prompts for developers to write compelling stories about their projects.
 *
 * - generateStoryPrompt - A function that generates a story prompt.
 * - GenerateStoryPromptInput - The input type for the generateStoryPrompt function.
 * - GenerateStoryPromptOutput - The return type for the generateStoryPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryPromptInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  projectType: z.string().describe('The type of project (e.g., web app, mobile app, library).'),
  developmentStage: z.string().describe('The current development stage of the project (e.g., early stage, in development, nearing completion, completed).'),
});

export type GenerateStoryPromptInput = z.infer<typeof GenerateStoryPromptInputSchema>;

const GenerateStoryPromptOutputSchema = z.object({
  prompt: z.string().describe('A prompt to inspire developers to write about their project.'),
});

export type GenerateStoryPromptOutput = z.infer<typeof GenerateStoryPromptOutputSchema>;

export async function generateStoryPrompt(input: GenerateStoryPromptInput): Promise<GenerateStoryPromptOutput> {
  return generateStoryPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStoryPromptPrompt',
  input: {schema: GenerateStoryPromptInputSchema},
  output: {schema: GenerateStoryPromptOutputSchema},
  prompt: `You are a creative prompt engineer specializing in inspiring developers to share their project stories. Generate a prompt that encourages the developer to reflect on their project's origin, challenges, pivotal moments, and the lessons they've learned throughout the development journey.

Project Name: {{{projectName}}}
Project Type: {{{projectType}}}
Development Stage: {{{developmentStage}}}

Prompt:
`,
});

const generateStoryPromptFlow = ai.defineFlow(
  {
    name: 'generateStoryPromptFlow',
    inputSchema: GenerateStoryPromptInputSchema,
    outputSchema: GenerateStoryPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
