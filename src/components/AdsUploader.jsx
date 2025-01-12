const AdsUploader = ({ads, setAds}) => {

  const handleFileChange = ({target}) => {
    setAds({
      ...ads,
      [target.name]: target.files[0],
    })
  }

  // const {adV1, adV2, adV3, adH} = ads

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   const formData = new FormData();
  //   if (image1) formData.append('image1', image1);
  //   if (image2) formData.append('image2', image2);
  //   if (image3) formData.append('image3', image3);

  //   const response = await fetch('/api/upload', {
  //     method: 'POST',
  //     body: formData,
  //   });

  //   const result = await response.json();
  //   if (response.ok) {
  //     alert('Files uploaded successfully!');
  //     console.log(result);
  //   } else {
  //     alert('Upload failed.');
  //     console.error(result.error);
  //   }
  // };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div
        className="bg-white p-8 rounded-lg shadow-md w-full"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Upload Ad Images
        </h2>

        <div className="mb-4">
          <label
            htmlFor="image1"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Vertical Ad 1
          </label>
          <input
            type="file"
            id="image1"
            accept="image/*"
            name="adV1"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="image2"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Vertical Ad 2
          </label>
          <input
            type="file"
            id="image2"
            accept="image/*"
            name="adV2"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="image3"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Vertical Ad 3
          </label>
          <input
            type="file"
            id="image3"
            accept="image/*"
            name="adV3"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="image3"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Horizontal Ad
          </label>
          <input
            type="file"
            id="image3"
            accept="image/*"
            name="adH"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>
    </div>
  );
}

export default AdsUploader