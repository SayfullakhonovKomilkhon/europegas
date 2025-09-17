import { collection, addDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import allProducts from '../data/products';

/**
 * Uploads all products to Firebase Firestore
 * This function should be called only once or when you need to reset the products
 */
export const uploadProductsToFirebase = async () => {
  try {
    console.log('Starting product upload to Firebase...');
    
    // Reference to the products collection
    const productsRef = collection(db, 'products');
    
    // Optional: Clear existing products first
    // Uncomment this section if you want to clear existing products before uploading
    /*
    console.log('Clearing existing products...');
    const existingProducts = await getDocs(productsRef);
    const deletePromises = existingProducts.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log(`Cleared ${existingProducts.docs.length} existing products.`);
    */
    
    // Upload each product
    const uploadPromises = allProducts.map(async (product) => {
      // Check if product with this ID already exists
      const existingQuery = query(productsRef, where('id', '==', product.id));
      const existingDocs = await getDocs(existingQuery);
      
      if (existingDocs.empty) {
        // Product doesn't exist, add it
        await addDoc(productsRef, product);
        return `Added new product: ${product.name}`;
      } else {
        // Product already exists, skip it
        return `Skipped existing product: ${product.name}`;
      }
    });
    
    const results = await Promise.all(uploadPromises);
    console.log('Product upload completed!');
    console.log(results);
    
    return {
      success: true,
      message: `Successfully processed ${allProducts.length} products.`,
      details: results
    };
  } catch (error) {
    console.error('Error uploading products to Firebase:', error);
    return {
      success: false,
      message: 'Failed to upload products to Firebase.',
      error
    };
  }
};

export default uploadProductsToFirebase; 