'use client'

import { useState } from "react"
import { ModalComponent } from "../ModalComponent"
import { toast } from "sonner";
import { FiUploadCloud } from "react-icons/fi";

const asyncThumbnailCompress = (path, id) => {
  return new Promise(async(resolve, reject) => {
    try{
      const res = await fetch("https://samara-image-compression-function-979817516257.asia-southeast2.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "path": path
          })
        })
      const jsonData = await res.json()
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/${id}/cover/thumbnail`,
        {
          method: "PUT",
          body: JSON.stringify({
            fileName: jsonData.url,
          })
        })
      resolve()
    } catch (err) {
      toast.warning("Failed to generate thumbnail")
      console.error(err)
      reject(err)
    }
  })
}

const handleUploadArticleHeadline = async(fileData, setIsLoading, onSuccess) => {
  setIsLoading(true)
  try{
    // get signed url from backend
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/${Number(fileData.articleId)}/cover`,
      {
        method: "POST",
        body: JSON.stringify({
          fileName: fileData.fileName,
          contentType: fileData.selectedImage.type,
        })
      })
    let jsonData = await res.json()
    if (!res.ok) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
    const {url, location} = jsonData.data
    
    // upload img to GCS using signed url
    res = await fetch(url,{
      headers: {
        "Content-Type": fileData.selectedImage.type
      },
      method: 'PUT',
      body: fileData.selectedImage,
    })
    if (!res.ok) {
      throw new Error(`${res.status}`)
    }
    
    // call asynchronous work to cloud function
    asyncThumbnailCompress(location, fileData.articleId)
    
    const cleanUrl = url.split("?")[0]
    const fileName = cleanUrl.replace(process.env.NEXT_PUBLIC_GCLOUD_PREFIX, "")
    res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/${Number(fileData.articleId)}/cover/rename`,
      {
        method: 'PUT',
        body: JSON.stringify({
          source: "google-cloud",
          newHeadline: fileName,
        })
      })
    if (!res.ok) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
    toast.success("Gambar berhasil diunggah")
    onSuccess()
  }catch(err){
    console.error(err.message)
    toast.error(err.message)
  }finally{
    setIsLoading(false)
  }
}

export const UploadCoverModal = ({articleId, editionId, setIsModalOpen, isOpen, onSuccess}) => {
  const [fileName, setFileName] = useState("")
  const [isLoading, setIsLoading] =  useState(false)
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setFileName(file.name)
    }
  };

  const onSubmit = (e) => {
    e.preventDefault()
    if (!selectedImage) {
      toast.error("Tentukan gambar yang akan diunggah")
      return
    }
    const fileData = {
      articleId,
      fileName,
      selectedImage
    }
    handleUploadArticleHeadline(
      fileData,
      setIsLoading,
      () => {
        setIsModalOpen(false)
        setFileName("")
        setSelectedImage(null)
        setPreviewUrl(null)
        onSuccess()
      })
  }

  const onReset = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    setFileName("")
  }

  return (
    <>
      <ModalComponent isOpen={isOpen} onClose={() => setIsModalOpen(false)}>
        <div>
          <p className="text-dark-primary font-bold text-xl mb-4">Unggah Gambar</p>
          <form onSubmit={onSubmit} onReset={onReset} className="w-180 flex flex-col justify-between">
            <div className="flex items-end gap-4">
              <div className="w-1/2">
                <h2 className="text-dark-primary/75 text-sm mb-2">Panduan <b><i>Search Engine Optimization</i> (SEO)</b> untuk nama <i>file</i>:</h2>
                <div className="text-dark-primary/75 text-sm flex flex-col gap-4 mb-6">
                  <div>
                    <p className="mb-1">1. Ganti spasi dengan <i>dash</i> (-) atau <i>underscore</i> (_). Contoh:</p>
                    <p className="mb-1 ml-2">✅ Lustrum-OMK-Kosambi-Baru.JPG</p>
                    <p className="mb-1 ml-2">✅ Lustrum_OMK_Kosambi_Baru.JPG</p>
                    <p className="mb-1 ml-2">👎 Lustrum OMK Kosambi Baru.JPG</p>
                  </div>
                  <div>
                    <p className="mb-1">2. Gunakan nama yang deskriptif. Contoh:</p>
                    <p className="mb-1 ml-2">✅ Penerimaan-Baptisan-Baru-2025.JPG</p>
                    <p className="mb-1 ml-2">👎 IMG20250301_183201.JPG</p>
                  </div>
                  <div>
                    <p className="mb-1">3. Jangan gunakan karakter spesial <b>/&lt;&gt;^\:&quot;|?*</b> Contoh:</p>
                    <p className="mb-1 ml-2">✅ Seminar-Hidup-Baru_Menjadi-Saksi-Kristus.JPG</p>
                    <p className="mb-1 ml-2">👎 Seminar-Hidup-Baru:-Menjadi-Saksi-Kristus.JPG</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-dark-primary/75 font-semibold">Simpan sebagai: <span className="text-rose-500">*</span></label>
                  <input
                    value={fileName}
                    className="w-full bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none disabled:cursor-not-allowed"
                    disabled={isLoading || !previewUrl}
                    onChange={(e)=>setFileName(e.target.value)}
                    required
                    />
                </div>
              </div>
              <div className="w-1/2">
              <div className="flex flex-col justify-center items-center gap-2 min-h-80 bg-slate-200 rounded-lg">
                {previewUrl ? (
                  <>
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-72 object-contain"
                      />
                    </div>
                    <p className="text-center text-sm text-gray-500">
                      {selectedImage && `${selectedImage.name} (${(selectedImage.size / 1024).toFixed(2)} KB)`}
                    </p>
                  </>
                ) : <p className="text-slate-400 font-bold text-2xl">Preview</p>}
                </div>
                <div className="flex items-center justify-center mt-2">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUploadCloud size={20} className='text-gray-500' />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Klik untuk mengunggah</span>
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG maksimum 2MB</p>
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
            <div className="flex w-full justify-end gap-2 mt-4">
              <button
                className="text-dark-primary/75 font-bold hover:bg-neutral-200 active:bg-neutral-300 px-4 py-2 rounded-lg transition-colors cursor-pointer min-w-28 disabled:text-dark-primary/30 disabled:bg-transparent disabled:cursor-not-allowed"
                aria-label="cancel create edition"
                title="Cancel"
                type="reset"
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
              >
              Tutup
              </button>
              <button
                className="text-white font-bold bg-blue-primary hover:bg-blue-400 active:bg-blue-600 px-4 py-2 rounded-lg transition-colors cursor-pointer min-w-28 disabled:bg-blue-primary/30 disabled:cursor-not-allowed"
                aria-label="submit new edition"
                title="Create"
                type="submit"
                disabled={isLoading}
              >
              {isLoading ? <div className="flex justify-center items-center w-full"><span className="loader"></span></div> : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </ModalComponent>
    </>
  )
}