import { promises as fs } from 'fs';
import fetch from 'node-fetch';

type CONFIG = {};
type INPUTS = { url: string };
type OUTPUT = { content: string };

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const response = await fetch(inputs.url);
  if (!response.ok) throw new Error('Failed to fetch the URL');
  
  const textParts = await response.text();
  return { content: textParts };
}