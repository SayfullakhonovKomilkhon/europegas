/**
 * Utility script to generate placeholder images for branches
 * 
 * This script creates colored rectangles with branch names as placeholders
 * for branch images. It saves the images to the public/images/branches directory.
 * 
 * Usage:
 * 1. Install required dependencies: npm install canvas fs-extra
 * 2. Run the script: node src/utils/generateBranchImages.js
 */

const fs = require('fs-extra');
const path = require('path');
const { createCanvas } = require('canvas');

// Ensure the branches directory exists
const branchesDir = path.join(process.cwd(), 'public', 'images', 'branches');
fs.ensureDirSync(branchesDir);

// Branch data from our application
const branches = [
  {
    id: '1',
    name: 'EuropeGAS Tashkent Headquarters',
    city: 'Tashkent',
    region: 'Tashkent',
    filename: 'tashkent-hq.jpg'
  },
  {
    id: '2',
    name: 'EuropeGAS Samarkand Branch',
    city: 'Samarkand',
    region: 'Samarkand',
    filename: 'samarkand.jpg'
  },
  {
    id: '3',
    name: 'EuropeGAS Bukhara Service Center',
    city: 'Bukhara',
    region: 'Bukhara',
    filename: 'bukhara.jpg'
  },
  {
    id: '4',
    name: 'EuropeGAS Andijan Branch',
    city: 'Andijan',
    region: 'Andijan',
    filename: 'andijan.jpg'
  },
  {
    id: '5',
    name: 'EuropeGAS Namangan Service Center',
    city: 'Namangan',
    region: 'Namangan',
    filename: 'namangan.jpg'
  },
  {
    id: '6',
    name: 'EuropeGAS Fergana Branch',
    city: 'Fergana',
    region: 'Fergana',
    filename: 'fergana.jpg'
  },
  {
    id: '7',
    name: 'EuropeGAS Nukus Branch',
    city: 'Nukus',
    region: 'Karakalpakstan',
    filename: 'nukus.jpg'
  },
  {
    id: '8',
    name: 'EuropeGAS Urgench Service Center',
    city: 'Urgench',
    region: 'Khorezm',
    filename: 'urgench.jpg'
  },
  {
    id: '9',
    name: 'EuropeGAS Navoi Branch',
    city: 'Navoi',
    region: 'Navoi',
    filename: 'navoi.jpg'
  },
  {
    id: '10',
    name: 'EuropeGAS Karshi Branch',
    city: 'Karshi',
    region: 'Kashkadarya',
    filename: 'karshi.jpg'
  },
  {
    id: '11',
    name: 'EuropeGAS Termez Service Center',
    city: 'Termez',
    region: 'Surkhandarya',
    filename: 'termez.jpg'
  },
  {
    id: '12',
    name: 'EuropeGAS Gulistan Branch',
    city: 'Gulistan',
    region: 'Syrdarya',
    filename: 'gulistan.jpg'
  },
  {
    id: '13',
    name: 'EuropeGAS Jizzakh Branch',
    city: 'Jizzakh',
    region: 'Jizzakh',
    filename: 'jizzakh.jpg'
  }
];

// Also create a generic placeholder
branches.push({
  id: 'placeholder',
  name: 'EuropeGAS Branch',
  city: 'Location',
  region: 'Region',
  filename: 'placeholder.jpg'
});

/**
 * Generate a color based on the branch name
 * @param {string} str - The string to generate a color from
 * @returns {string} - A hex color code
 */
function generateColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 60%)`;
}

/**
 * Generate a placeholder image for a branch
 * @param {Object} branch - The branch data
 */
function generatePlaceholderImage(branch) {
  const width = 800;
  const height = 450;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fill background with a color based on the branch name
  const bgColor = generateColorFromString(branch.region);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Add a pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < width; i += 20) {
    ctx.fillRect(i, 0, 10, height);
  }
  
  // Add a logo placeholder
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.beginPath();
  ctx.arc(width / 2, height / 2 - 40, 60, 0, Math.PI * 2);
  ctx.fill();
  
  // Add text
  ctx.textAlign = 'center';
  
  // Branch name
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(branch.name, width / 2, height / 2 + 60, width - 40);
  
  // City and region
  ctx.font = '30px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText(`${branch.city}, ${branch.region}`, width / 2, height / 2 + 110, width - 40);
  
  // Save the image
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  const filePath = path.join(branchesDir, branch.filename);
  fs.writeFileSync(filePath, buffer);
  
  console.log(`Generated image for ${branch.name}: ${filePath}`);
}

/**
 * Generate all placeholder images
 */
async function generateAllPlaceholderImages() {
  console.log('Generating branch placeholder images...');
  
  for (const branch of branches) {
    generatePlaceholderImage(branch);
  }
  
  console.log('All branch placeholder images generated successfully!');
}

// Run the script
generateAllPlaceholderImages().catch(console.error); 