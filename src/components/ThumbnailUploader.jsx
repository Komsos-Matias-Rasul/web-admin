import { useState } from 'react';

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