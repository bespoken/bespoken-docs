#!/usr/bin/env node

/**
 * Algolia Indexer Script
 * Indexes markdown files from the project into Algolia
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const algoliasearch = require('algoliasearch');
const frontMatter = require('front-matter');

// Get credentials from environment
const APP_ID = process.env.ALGOLIA_APP_ID;
const API_KEY = process.env.ALGOLIA_API_KEY;
const INDEX_NAME = process.env.ALGOLIA_INDEX_NAME || 'bespoken';
const BASE_URL = 'https://read.bespoken.ai';

// Paths to exclude from indexing (not publicly available)
const EXCLUDED_PATHS = [
  'cli/',
  'end-to-end/',
  'releases/',
  'api/cli/',
  'blogs/',
  'google-marketplace/'
];

if (!APP_ID || !API_KEY) {
  console.error('❌ Error: Missing required environment variables');
  console.error('   Create a .env file with:');
  console.error('   ALGOLIA_APP_ID=your_application_id');
  console.error('   ALGOLIA_API_KEY=your_write_api_key');
  process.exit(1);
}

// Check if a path should be excluded from indexing
function shouldExcludePath(relativePath) {
  return EXCLUDED_PATHS.some(excludedPath => relativePath.startsWith(excludedPath));
}

// Map folder structure to categories
function getCategoryFromPath(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  
  if (relativePath.startsWith('dashboard/')) return 'Dashboard';
  if (relativePath.startsWith('guides/')) return 'Platform Guides';
  if (relativePath.startsWith('monitoring/')) return 'Monitoring';
  if (relativePath.startsWith('api/')) return 'API';
  if (relativePath.startsWith('faq/')) return 'FAQ';
  if (relativePath.startsWith('training/')) {
    if (relativePath.includes('chatbot')) return 'Training - Chatbot';
    if (relativePath.includes('ivr')) return 'Training - IVR';
    return 'Training';
  }
  
  return 'Documentation';
}

// Extract sections from markdown (split by headers)
function extractSections(content, category = '') {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = {
    lvl0: category,
    lvl1: '',
    lvl2: '',
    lvl3: '',
    lvl4: '',
    content: []
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('# ')) {
      // New H1 - save previous section and start new
      if (currentSection.lvl1 || currentSection.content.length > 0) {
        sections.push({ ...currentSection });
      }
      currentSection = {
        lvl0: category, // Keep category
        lvl1: line.replace(/^#\s+/, '').trim(),
        lvl2: '',
        lvl3: '',
        lvl4: '',
        content: []
      };
    } else if (line.startsWith('## ')) {
      // New H2 - save previous section and start new
      if (currentSection.lvl2 || currentSection.content.length > 0) {
        sections.push({ ...currentSection });
      }
      currentSection.lvl2 = line.replace(/^##\s+/, '').trim();
      currentSection.lvl3 = '';
      currentSection.lvl4 = '';
      currentSection.content = [];
    } else if (line.startsWith('### ')) {
      // New H3 - save previous section and start new
      if (currentSection.lvl3 || currentSection.content.length > 0) {
        sections.push({ ...currentSection });
      }
      currentSection.lvl3 = line.replace(/^###\s+/, '').trim();
      currentSection.lvl4 = '';
      currentSection.content = [];
    } else if (line.startsWith('#### ')) {
      // New H4 - save previous section and start new
      if (currentSection.lvl4 || currentSection.content.length > 0) {
        sections.push({ ...currentSection });
      }
      currentSection.lvl4 = line.replace(/^####\s+/, '').trim();
      currentSection.content = [];
    } else if (line.trim() && !line.startsWith('```') && !line.startsWith('---')) {
      // Regular content line
      currentSection.content.push(line.trim());
    }
  }
  
  // Don't forget the last section
  if (currentSection.lvl1 || currentSection.content.length > 0) {
    sections.push(currentSection);
  }
  
  return sections;
}

// Extract a contextual snippet for search indexing and display
// Truncates intelligently at word boundaries to avoid cutting words in half
function extractSnippet(lines, maxLength = 120) {
  if (!lines || lines.length === 0) return '';
  
  // Get first meaningful lines for context
  const text = lines
    .filter(line => {
      const trimmed = line.trim();
      // Skip very short lines, headers, code blocks, and special markdown
      return trimmed.length > 10 && 
             !trimmed.startsWith('#') && 
             !trimmed.startsWith('```') &&
             !trimmed.startsWith('---') &&
             !trimmed.startsWith(':::');
    })
    .slice(0, 3) // Take first 3 meaningful lines
    .join(' ')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links, keep text
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '') // Remove images
    .replace(/`([^`]+)`/g, '$1') // Remove code backticks, keep content
    .replace(/\*\*([^\*]+)\*\*/g, '$1') // Remove bold, keep text
    .replace(/\*([^\*]+)\*/g, '$1') // Remove italic, keep text
    .replace(/:::.*?:::/gs, '') // Remove custom containers
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  if (text.length === 0) return '';
  
  // If text is shorter than max, return as is
  if (text.length <= maxLength) return text;
  
  // Truncate at word boundary (find last space before maxLength)
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  // If we found a space and it's not too close to the start, use it
  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  // Otherwise, just truncate (rare case where word is very long)
  return truncated + '...';
}

// Get all markdown files recursively
function getAllMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const relativePath = path.relative(process.cwd(), filePath);
    
    // Skip excluded paths (not publicly available)
    if (shouldExcludePath(relativePath)) {
      return; // Skip this file/directory
    }
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      getAllMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md') && (file !== 'README.md' || dir !== process.cwd())) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Clear index before reindexing
async function clearIndex(index) {
  try {
    console.log('🗑️  Clearing existing index...');
    await index.clearObjects();
    console.log('✅ Index cleared');
  } catch (error) {
    console.log('⚠️  Could not clear index (might be empty):', error.message);
  }
}

// Main function
async function main() {
  console.log('🚀 Starting Algolia indexing...');
  console.log(`   App ID: ${APP_ID}`);
  console.log(`   Index: ${INDEX_NAME}`);
  console.log('');
  
  // Initialize Algolia client
  const client = algoliasearch(APP_ID, API_KEY);
  const index = client.initIndex(INDEX_NAME);
  
  // Clear existing index
  await clearIndex(index);
  console.log('');
  
  try {
    // Get all markdown files
    const mdFiles = getAllMarkdownFiles(process.cwd());
    console.log(`📄 Found ${mdFiles.length} markdown files`);
    console.log('');
    
    const records = [];
    
    for (const filePath of mdFiles) {
      try {
        // Skip excluded paths (not publicly available)
        const relativePath = path.relative(process.cwd(), filePath);
        if (shouldExcludePath(relativePath)) {
          console.log(`⏭️  Skipping (not public): ${relativePath}`);
          continue;
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = frontMatter(content);
        const frontmatter = parsed.attributes;
        const body = parsed.body;
        
        // Get permalink or generate from file path
        let permalink = frontmatter.permalink;
        if (!permalink) {
          const relativePath = path.relative(process.cwd(), filePath);
          permalink = '/' + relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
          if (permalink.endsWith('/README')) {
            permalink = permalink.replace('/README', '/');
          }
        }
        if (!permalink.endsWith('/') && permalink !== '/') {
          permalink += '/';
        }
        
        const url = BASE_URL + permalink;
        const category = getCategoryFromPath(filePath);
        const sections = extractSections(body, category);
        
        // If no sections found, create one default record
        if (sections.length === 0) {
          const title = frontmatter.title || path.basename(filePath, '.md');
          const objectID = `${url.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'home'}_0`;
          
          records.push({
            objectID: objectID,
            url: url,
            url_without_anchor: url,
            hierarchy: {
              lvl0: category,
              lvl1: title,
              lvl2: null,
              lvl3: null,
              lvl4: null
            },
            content: extractSnippet(body.split('\n').filter(l => l.trim())),
            type: 'content'
          });
        } else {
          // Create one record per section
          sections.forEach((section, index) => {
            const anchor = section.lvl2 
              ? '#' + section.lvl2.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
              : section.lvl3
              ? '#' + section.lvl3.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
              : section.lvl4
              ? '#' + section.lvl4.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
              : '';
            
            const sectionUrl = url + anchor;
            const objectID = `${url.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'home'}_${index}`;
            
            // Use frontmatter title as lvl1 if section doesn't have one
            const lvl1 = section.lvl1 || frontmatter.title || path.basename(filePath, '.md');
            
            records.push({
              objectID: objectID,
              url: sectionUrl,
              url_without_anchor: url,
              hierarchy: {
                lvl0: section.lvl0 || category,
                lvl1: lvl1,
                lvl2: section.lvl2 || null,
                lvl3: section.lvl3 || null,
                lvl4: section.lvl4 || null
              },
              content: extractSnippet(section.content),
              type: 'content'
            });
          });
        }
        
        console.log(`✅ ${frontmatter.title || path.basename(filePath)} (${sections.length || 1} sections)`);
        
      } catch (e) {
        console.log(`⚠️  Error processing ${filePath}: ${e.message}`);
      }
    }
    
    console.log('');
    console.log(`📤 Uploading ${records.length} records to Algolia...`);
    
    // Upload in batches
    const batchSize = 100;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      await index.saveObjects(batch);
      console.log(`   ✅ Indexed ${Math.min(i + batchSize, records.length)}/${records.length} records`);
    }
    
    console.log('');
    console.log('✅ Indexing complete!');
    console.log(`   Check your index at: https://dashboard.algolia.com/apps/${APP_ID}/indices/${INDEX_NAME}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

main();
