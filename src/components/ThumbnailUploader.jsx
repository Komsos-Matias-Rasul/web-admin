"use client"
import { Button } from '@heroui/button';
import { useState } from 'react';
import { FiUploadCloud } from "react-icons/fi";


export const ImageInput = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white">
      <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
        Thumbmail Image
      </label>
      {previewUrl && (
        <div>
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-contain rounded-lg"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {selectedImage && `${selectedImage.name} (${(selectedImage.size / 1024).toFixed(2)} KB)`}
          </p>
        </div>
      )}
      {
        selectedImage && <Button radius='full' fullWidth className='mt-2 bg-violet-500 text-white'>Upload</Button>
      }
      <div className="mt-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FiUploadCloud size={20} className='text-gray-500' />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
            </div>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/jpg,image/jpeg,image/png"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};



const ThumbnailUploader = ({thumbnail, setThumbnail}) => {
  const [previewUrl, setPreviewUrl] = useState(thumbnail);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnail(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-96">
      <div className="mb-2">
        <label 
          htmlFor="imageUpload" 
          className="block mb-2"
        >
          Thumbnail: <span className='text-rose-500'>*</span>
        </label>
        <input 
          type="file" 
          onChange={handleFileChange}
          accept="image/*"
          className="block w-full text-sm text-gray-500 
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
        />
      </div>

      {previewUrl && (
        <div className="mb-2 text-center">
          <h3 className="text-lg font-medium mb-2 text-gray-700">Thumbnail Preview:</h3>
          <div className="flex justify-center">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full max-h-64 object-contain rounded-lg shadow-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ThumbnailUploader;