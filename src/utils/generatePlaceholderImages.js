/**
 * This is a utility script to generate placeholder images for our products.
 * It creates colored rectangles with product names as placeholders.
 * 
 * Usage:
 * 1. Install required packages: npm install canvas fs-extra
 * 2. Run the script: node generatePlaceholderImages.js
 */

const fs = require('fs-extra');
const path = require('path');
const { createCanvas } = require('canvas');

// Import product data
const allProducts = require('../data/products').default;

// Create the directory if it doesn't exist
const imagesDir = path.join(__dirname, '../../public/images/products');
fs.ensureDirSync(imagesDir);

// Create category directories
const categories = ['ecu-control-units', 'rail-injectors', 'gas-reducers'];
categories.forEach(category => {
  fs.ensureDirSync(path.join(imagesDir, category));
});

// Function to generate a color from a string
function generateColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

// Function to generate a placeholder image
function generatePlaceholderImage(product, index, category) {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background with a color based on the product name
  const bgColor = generateColorFromString(product.name);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Add product name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Wrap text if needed
  const words = product.name.split(' ');
  const lines = [];
  let currentLine = words[0];
  
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < 700) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  
  // Draw each line
  const lineHeight = 50;
  const startY = height / 2 - (lines.length - 1) * lineHeight / 2;
  
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight);
  });
  
  // Add category and price
  ctx.font = '30px Arial';
  ctx.fillText(product.category, width / 2, height - 100);
  ctx.fillText(`$${product.price.toFixed(2)}`, width / 2, height - 50);
  
  // Add a border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, width - 20, height - 20);
  
  // Save the image
  const categoryFolder = product.category.toLowerCase().replace(/\s+/g, '-');
  const filename = `${categoryFolder}-${index + 1}.jpg`;
  const filePath = path.join(imagesDir, categoryFolder, filename);
  
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(filePath, buffer);
  
  console.log(`Generated: ${filename}`);
  return filename;
}

// Main function to generate all placeholder images
async function generateAllPlaceholderImages() {
  console.log('Starting placeholder image generation...');
  
  // Group products by category
  const productsByCategory = {};
  
  allProducts.forEach(product => {
    const category = product.category;
    if (!productsByCategory[category]) {
      productsByCategory[category] = [];
    }
    productsByCategory[category].push(product);
  });
  
  // Generate images for each category
  for (const [category, products] of Object.entries(productsByCategory)) {
    console.log(`Generating images for ${category}...`);
    
    products.forEach((product, index) => {
      generatePlaceholderImage(product, index, category);
    });
  }
  
  console.log('\nImage generation complete!');
  console.log(`Images saved to: ${imagesDir}`);
}

// Run the generation function
generateAllPlaceholderImages().catch(error => {
  console.error('An error occurred:', error);
}); 