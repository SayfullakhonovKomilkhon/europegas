import React, { useState } from 'react';
import { uploadProductsToFirebase } from '../../utils/uploadProducts';

const UploadProducts: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async () => {
    if (uploading) return;
    
    setUploading(true);
    try {
      const uploadResult = await uploadProductsToFirebase();
      setResult(uploadResult);
    } catch (error) {
      console.error('Error in upload handler:', error);
      setResult({
        success: false,
        message: 'An unexpected error occurred during upload.',
        error
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Upload Products to Firebase</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <p className="mb-4">
          This utility will upload all products from the local data file to your Firebase Firestore database.
          Use this only when you need to initialize or reset your product catalog.
        </p>
        
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`px-4 py-2 rounded font-medium ${
            uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Products'}
        </button>
      </div>
      
      {result && (
        <div className={`p-4 rounded-lg mb-6 ${
          result.success ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'
        }`}>
          <h2 className="font-bold mb-2">
            {result.success ? 'Upload Successful' : 'Upload Failed'}
          </h2>
          <p className="mb-2">{result.message}</p>
          
          {result.details && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Details:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
                {Array.isArray(result.details)
                  ? result.details.map((detail: string, index: number) => (
                      <div key={index}>{detail}</div>
                    ))
                  : JSON.stringify(result.details, null, 2)}
              </pre>
            </div>
          )}
          
          {result.error && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Error:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60">
                {JSON.stringify(result.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadProducts; 