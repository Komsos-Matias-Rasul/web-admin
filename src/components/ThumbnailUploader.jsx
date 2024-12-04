import React, { useState } from 'react';

const ThumbnailUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Actual upload logic would go here
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      // Example of how you might upload to a server
      // fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData
      // })
      // .then(response => response.json())
      // .then(data => {
      //   console.log('Upload successful', data);
      // })
      // .catch(error => {
      //   console.error('Upload failed', error);
      // });

      console.log('File ready to upload:', selectedFile);
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
          id="imageUpload"
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
          <h3 className="text-lg font-medium mb-2 text-gray-700">Preview</h3>
          <div className="flex justify-center">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full max-h-64 object-contain rounded-lg shadow-md"
            />
          </div>
        </div>
      )}

      <button 
        onClick={handleUpload}
        disabled={!selectedFile}
        className={`w-full py-3 rounded-lg text-white text-sm font-semibold transition-colors duration-300 
          ${selectedFile 
            ? 'bg-violet-600 hover:bg-violet-700 active:bg-violet-800' 
            : 'bg-gray-400 cursor-not-allowed'
          }`}
      >
        {selectedFile 
          ? `Upload ${selectedFile.name}` 
          : 'Select an Image'}
      </button>
    </div>
  );
};

export default ThumbnailUploader;