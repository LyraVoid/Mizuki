import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProjectsData, getSkillsData, getTimelineData } from './dataParser.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Migrate TypeScript data files to JSON
 * This is a one-time migration to enable CRUD operations
 */
export async function migrateDataToJson() {
  const dataDir = path.join(__dirname, '../../src/data');
  const jsonDir = path.join(dataDir, 'json');
  
  // Ensure JSON directory exists
  await fs.mkdir(jsonDir, { recursive: true });
  
  console.log('🔄 Starting data migration...');
  
  try {
    // Migrate Projects
    console.log('  📦 Migrating projects.ts → projects.json');
    const projects = await getProjectsData();
    await fs.writeFile(
      path.join(jsonDir, 'projects.json'),
      JSON.stringify(projects, null, 2),
      'utf-8'
    );
    console.log(`  ✅ Migrated ${projects.length} projects`);
    
    // Migrate Skills
    console.log('  🎯 Migrating skills.ts → skills.json');
    const skills = await getSkillsData();
    await fs.writeFile(
      path.join(jsonDir, 'skills.json'),
      JSON.stringify(skills, null, 2),
      'utf-8'
    );
    console.log(`  ✅ Migrated ${skills.length} skills`);
    
    // Migrate Timeline
    console.log('  ⏱️  Migrating timeline.ts → timeline.json');
    const timeline = await getTimelineData();
    await fs.writeFile(
      path.join(jsonDir, 'timeline.json'),
      JSON.stringify(timeline, null, 2),
      'utf-8'
    );
    console.log(`  ✅ Migrated ${timeline.length} timeline events`);
    
    console.log('\n✨ Migration complete! JSON files created in src/data/json/');
    console.log('📝 You can now edit data via the admin dashboard.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateDataToJson()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
