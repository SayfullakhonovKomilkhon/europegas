/**
 * This is a utility script to download product images from the internet.
 * You can run this script using Node.js to download images for your products.
 * 
 * Usage:
 * 1. Install required packages: npm install node-fetch fs-extra
 * 2. Run the script: node downloadProductImages.js
 */

const fetch = require('node-fetch');
const fs = require('fs-extra');
const path = require('path');
const { promisify } = require('util');
const stream = require('stream');

const pipeline = promisify(stream.pipeline);

// Create the directory if it doesn't exist
const imagesDir = path.join(__dirname, '../../public/images/products');
fs.ensureDirSync(imagesDir);

// Sample image URLs for each product category
const imageUrls = {
  'ECU Control Units': [
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1022/2693/STAG-QBOX-PLUS-ECU__01559.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1023/2695/STAG-QNEXT-PLUS-ECU__01560.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1024/2697/STAG-300-PREMIUM-ECU__01561.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1025/2699/STAG-400-DPI-ECU__01562.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1026/2701/STAG-DIESEL-ECU__01563.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1027/2703/STAG-GOFAST-ECU__01564.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1028/2705/STAG-200-GOFAST-ECU__01565.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1029/2707/STAG-300-PREMIUM-OBD-ECU__01566.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1030/2709/STAG-4-QBOX-ECU__01567.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1031/2711/STAG-300-ISA2-ECU__01568.1591639553.jpg'
  ],
  'Rail Injectors': [
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1032/2713/STAG-AC-W01-RAIL-INJECTOR__01569.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1033/2715/STAG-AC-W02-RAIL-INJECTOR__01570.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1034/2717/STAG-AC-W03-RAIL-INJECTOR__01571.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1035/2719/STAG-AC-W04-RAIL-INJECTOR__01572.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1036/2721/STAG-AC-W05-RAIL-INJECTOR__01573.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1037/2723/STAG-AC-W06-RAIL-INJECTOR__01574.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1038/2725/STAG-AC-W07-RAIL-INJECTOR__01575.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1039/2727/STAG-AC-W08-RAIL-INJECTOR__01576.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1040/2729/STAG-AC-W09-RAIL-INJECTOR__01577.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1041/2731/STAG-AC-W10-RAIL-INJECTOR__01578.1591639553.jpg'
  ],
  'Gas Reducers': [
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1042/2733/STAG-R01-REDUCER__01579.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1043/2735/STAG-R02-REDUCER__01580.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1044/2737/STAG-R03-REDUCER__01581.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1045/2739/STAG-R04-REDUCER__01582.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1046/2741/STAG-R05-REDUCER__01583.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1047/2743/STAG-R06-REDUCER__01584.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1048/2745/STAG-R07-REDUCER__01585.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1049/2747/STAG-R08-REDUCER__01586.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1050/2749/STAG-R09-REDUCER__01587.1591639553.jpg',
    'https://cdn11.bigcommerce.com/s-yvwvxk/images/stencil/1280x1280/products/1051/2751/STAG-R10-REDUCER__01588.1591639553.jpg'
  ]
};

// Function to download an image
async function downloadImage(url, filename) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    const filePath = path.join(imagesDir, filename);
    await pipeline(response.body, fs.createWriteStream(filePath));
    
    console.log(`Downloaded: ${filename}`);
    return filename;
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
    return null;
  }
}

// Main function to download all images
async function downloadAllImages() {
  console.log('Starting image download...');
  
  const downloadPromises = [];
  
  // Process each category
  for (const [category, urls] of Object.entries(imageUrls)) {
    // Create a folder for each category
    const categoryFolder = category.toLowerCase().replace(/\s+/g, '-');
    const categoryPath = path.join(imagesDir, categoryFolder);
    fs.ensureDirSync(categoryPath);
    
    // Download each image in the category
    urls.forEach((url, index) => {
      const extension = path.extname(url) || '.jpg';
      const filename = `${categoryFolder}/${categoryFolder}-${index + 1}${extension}`;
      downloadPromises.push(downloadImage(url, filename));
    });
  }
  
  // Wait for all downloads to complete
  const results = await Promise.all(downloadPromises);
  const successCount = results.filter(Boolean).length;
  
  console.log(`\nDownload complete!`);
  console.log(`Successfully downloaded ${successCount} of ${downloadPromises.length} images.`);
  console.log(`Images saved to: ${imagesDir}`);
}

// Run the download function
downloadAllImages().catch(error => {
  console.error('An error occurred:', error);
}); 