import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { readData } from './dataCrud.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Generate TypeScript file from JSON data
 */
export async function generateTsFromJson(type) {
  const data = await readData(type);
  
  // Get interface name and data variable name
  const interfaceName = getInterfaceName(type);
  const dataVarName = `${type}Data`;
  
  // Read the original TS file to preserve interface definitions and helper functions
  const originalTsPath = path.join(__dirname, `../../src/data/${type}.ts`);
  const originalContent = await fs.readFile(originalTsPath, 'utf-8');
  
  // Extract interface definition and helper functions
  const interfaceMatch = originalContent.match(/export interface[\s\S]*?^}/m);
  const interfaceCode = interfaceMatch ? interfaceMatch[0] : '';
  
  // Extract helper functions (everything after the data array)
  const helperFunctionsMatch = originalContent.match(/\/\/ Get.*[\s\S]*$/);
  const helperFunctions = helperFunctionsMatch ? helperFunctionsMatch[0] : '';
  
  // Generate new TS file
  const tsContent = `// ${interfaceName} data configuration file
// Auto-generated from JSON - Edit via admin dashboard
// Last updated: ${new Date().toISOString()}

${interfaceCode}

export const ${dataVarName}: ${interfaceName}[] = ${JSON.stringify(data, null, 2)};

${helperFunctions}
`;

  // Write TS file
  const tsPath = path.join(__dirname, `../../src/data/${type}.ts`);
  await fs.writeFile(tsPath, tsContent, 'utf-8');
  
  console.log(`✅ Generated ${type}.ts from JSON (${data.length} items)`);
  return { type, itemCount: data.length };
}

/**
 * Generate all TS files from JSON
 */
export async function generateAllTsFiles() {
  const results = [];
  
  for (const type of ['projects', 'skills', 'timeline']) {
    try {
      const result = await generateTsFromJson(type);
      results.push(result);
    } catch (error) {
      console.error(`Failed to generate ${type}.ts:`, error);
      results.push({ type, error: error.message });
    }
  }
  
  return results;
}

/**
 * Get TypeScript interface name from type
 */
function getInterfaceName(type) {
  const map = {
    projects: 'Project',
    skills: 'Skill',
    timeline: 'TimelineItem'
  };
  return map[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const type = process.argv[2];
  
  if (type) {
    generateTsFromJson(type)
      .then(() => process.exit(0))
      .catch(err => {
        console.error(err);
        process.exit(1);
      });
  } else {
    generateAllTsFiles()
      .then(() => process.exit(0))
      .catch(err => {
        console.error(err);
        process.exit(1);
      });
  }
}
