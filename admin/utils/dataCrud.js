import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JSON_DIR = path.join(__dirname, '../../src/data/json');

/**
 * Read data from JSON file
 */
export async function readData(type) {
  const jsonPath = path.join(JSON_DIR, `${type}.json`);
  const data = await fs.readFile(jsonPath, 'utf-8');
  return JSON.parse(data);
}

/**
 * Create new item
 */
export async function createItem(type, item) {
  const data = await readData(type);
  
  // Validate ID uniqueness
  if (data.find(d => d.id === item.id)) {
    throw new Error(`Item with ID "${item.id}" already exists`);
  }
  
  // Add item to array
  data.push(item);
  
  // Save
  await saveData(type, data);
  
  console.log(`✅ Created ${type} item: ${item.id}`);
  return item;
}

/**
 * Update existing item
 */
export async function updateItem(type, id, updates) {
  const data = await readData(type);
  const index = data.findIndex(d => d.id === id);
  
  if (index === -1) {
    throw new Error(`Item with ID "${id}" not found`);
  }
  
  // Merge updates
  data[index] = { ...data[index], ...updates, id }; // Preserve ID
  
  // Save
  await saveData(type, data);
  
  console.log(`✅ Updated ${type} item: ${id}`);
  return data[index];
}

/**
 * Delete item
 */
export async function deleteItem(type, id) {
  const data = await readData(type);
  const filtered = data.filter(d => d.id !== id);
  
  if (filtered.length === data.length) {
    throw new Error(`Item with ID "${id}" not found`);
  }
  
  // Save
  await saveData(type, filtered);
  
  console.log(`✅ Deleted ${type} item: ${id}`);
  return { id, deleted: true };
}

/**
 * Save data to JSON file with automatic backup
 */
async function saveData(type, data) {
  const jsonPath = path.join(JSON_DIR, `${type}.json`);
  const backupPath = path.join(JSON_DIR, `${type}.backup.json`);
  
  // Create backup of current file
  try {
    const currentData = await fs.readFile(jsonPath, 'utf-8');
    await fs.writeFile(backupPath, currentData, 'utf-8');
  } catch (err) {
    // Ignore if file doesn't exist yet
    if (err.code !== 'ENOENT') {
      console.warn('Warning: Could not create backup:', err.message);
    }
  }
  
  // Write new data
  await fs.writeFile(jsonPath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Restore from backup
 */
export async function restoreFromBackup(type) {
  const jsonPath = path.join(JSON_DIR, `${type}.json`);
  const backupPath = path.join(JSON_DIR, `${type}.backup.json`);
  
  const backupData = await fs.readFile(backupPath, 'utf-8');
  await fs.writeFile(jsonPath, backupData, 'utf-8');
  
  console.log(`✅ Restored ${type} from backup`);
}
