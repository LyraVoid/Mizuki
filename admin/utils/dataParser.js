import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Simple TypeScript data file parser
 * Extracts the exported data array using regex (safe, no TS compilation)
 */
export async function parseDataFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Find the exported data array
    // Match pattern: export const xxxData: Type[] = [ ... ];
    const dataMatch = content.match(/export const \w+Data[^=]*=\s*(\[[\s\S]*?\]);/);
    
    if (!dataMatch) {
      throw new Error('Could not find data array in file');
    }
    
    // Extract the array string
    const arrayString = dataMatch[1];
    
    // Use Function constructor to safely evaluate the array
    // This is safer than eval() and doesn't require full TS parsing
    const data = new Function(`return ${arrayString}`)();
    
    return data;
  } catch (error) {
    console.error(`Error parsing data file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Read projects data
 */
export async function getProjectsData() {
  const projectsPath = path.join(__dirname, '../../src/data/projects.ts');
  console.log('[DEBUG] Projects path resolved to:', projectsPath);
  return await parseDataFile(projectsPath);
}

/**
 * Read skills data
 */
export async function getSkillsData() {
  const skillsPath = path.join(__dirname, '../../src/data/skills.ts');
  return await parseDataFile(skillsPath);
}

/**
 * Read timeline data
 */
export async function getTimelineData() {
  const timelinePath = path.join(__dirname, '../../src/data/timeline.ts');
  return await parseDataFile(timelinePath);
}
