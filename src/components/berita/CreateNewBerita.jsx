"use client"
import { ModalComponent } from "../ModalComponent"
import { toast } from 'sonner'
import { useState } from "react"
import { FiUploadCloud } from "react-icons/fi"

const handleSubmit = async (beritaData, setIsLoading, _onSuccess) => {
  try {
    setIsLoading(true)
    const contentType = beritaData.selectedImage.type
    let res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/berita`, {
      method: "POST",
      body: JSON.stringify({...beritaData, contentType, selectedImage: null})
    })
    const jsonData = await res.json()
    if (!res.ok) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }

    const { url, location } = jsonData.data
    res = await fetch(url,{
      headers: {
        "Content-Type": beritaData.selectedImage.type
      },
      method: 'PUT',
      body: beritaData.selectedImage,
    })
    if (!res.ok) {
      throw new Error(`${res.status}`)
    }
    toast.success("Edisi berhasil ditambahkan")
    _onSuccess()
  } catch (err) {
    console.error(err)
    toast.error(err.message)
  } finally {
    setIsLoading(false)
  }
}

export const CreateNewBeritaModal = ({ onSuccess = () => null }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [beritaTitle, setBeritaTitle] = useState("")
  const [section, setSection] = useState("")
  const [publishStart, setPublishStart] = useState("")
  const [publishEnd, setPublishEnd] = useState("")
  const [descriptions, setDescriptions] = useState("")
  const [details, setDetails] = useState("")
  const [fileName, setFileName] = useState("")
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const onReset = () => {
    setBeritaTitle("")
    setSection("")
    setPublishStart("")
    setPublishEnd("")
    setDescriptions("")
    setDetails("")
  }

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
    if (!publishStart || !publishEnd) {
      setError("kolom tanggal belum diisi.");
      return;
    }

    if (new Date(publishEnd) < new Date(publishStart)) {
      setError("Tanggal berhenti publikasi harus berisi tanggal setelah mulai publikasi.");
      return;
    }

    const beritaData = {
      title: beritaTitle,
      section,
      descriptions,
      details,
      publishStart: new Date(publishStart).toISOString(),
      publishEnd: new Date(publishEnd).toISOString(),
      thumbImg: fileName,
      selectedImage,
    }
    const _onSuccess = () => {
      setBeritaTitle("")
      setSection("")
      setPublishStart("")
      setPublishEnd("")
      setDescriptions("")
      setDetails("")
      setIsModalOpen(false)
      onSuccess()
    }
    handleSubmit(beritaData, setIsLoading, _onSuccess)
  }
  
  return (
    <>
      <button
        className="bg-blue-primary text-white font-bold hover:bg-blue-400 active:bg-sky-700 px-4 py-2 rounded-lg transition-colors cursor-pointer"
        aria-label="buat berita"
        title="Buat Berita"
        onClick={() => setIsModalOpen(true)}
      >
      Buat Berita
      </button>
      <ModalComponent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-dark-primary text-lg font-semibold">Buat Berita Baru</div>
        <form onReset={onReset} onSubmit={onSubmit} className="w-250 flex gap-4">
          <div className="flex flex-col gap-4 mt-4 w-1/2">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-dark-primary/75 font-semibold">Judul Berita: <span className="text-rose-500">*</span></label>
              <input
                placeholder="Rekrutmen Misdinar 2026"
                value={beritaTitle}
                onChange={(e) => setBeritaTitle(e.target.value)}
                className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                required
                disabled={isLoading}
                />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-dark-primary/75 font-semibold">Bagian: <span className="text-rose-500">*</span></label>
              <input
                placeholder="Seksi Liturgi"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                required
                disabled={isLoading}
                />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-dark-primary/75 font-semibold">Deskripsi singkat: <span className="text-rose-500">*</span></label>
              <textarea
                rows={2}
                placeholder="Cth: [section] mengadakan [kegiatan] pada [waktu singkat]. Terima kasih."
                value={descriptions}
                onChange={(e) => setDescriptions(e.target.value)}
                className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                required
                disabled={isLoading}
                />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-dark-primary/75 font-semibold">Detail: <span className="text-rose-500">*</span></label>
              <textarea
                rows={5}
                placeholder="Cth: [section] mengadakan [kegiatan] pada [waktu singkat]. Terima kasih."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                required
                disabled={isLoading}
                />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-dark-primary/75 font-semibold">Tanggal mulai publikasi: <span className="text-rose-500">*</span></label>
              <input
                value={publishStart}
                onChange={(e) => setPublishStart(e.target.value)}
                className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                required
                type="date"
                disabled={isLoading}
                />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-dark-primary/75 font-semibold">Tanggal berhenti publikasi: <span className="text-rose-500">*</span></label>
              <input
                value={publishEnd}
                min={publishStart}
                onChange={(e) => setPublishEnd(e.target.value)}
                className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                required
                type="date"
                disabled={isLoading}
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
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm text-dark-primary/75 font-semibold">Simpan sebagai: <span className="text-rose-500">*</span></label>
              <input
                value={fileName}
                className="w-full bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none disabled:cursor-not-allowed"
                disabled={isLoading || !previewUrl}
                onChange={(e)=>setFileName(e.target.value)}
                required
                />
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
              Cancel
              </button>
              <button
                className="text-white font-bold bg-blue-primary hover:bg-blue-400 active:bg-blue-600 px-4 py-2 rounded-lg transition-colors cursor-pointer min-w-28 disabled:bg-blue-primary/30 disabled:cursor-not-allowed"
                aria-label="submit new edition"
                title="Create"
                type="submit"
                disabled={isLoading}
              >
              {isLoading ? <div className="flex justify-center items-center w-full"><span className="loader"></span></div> : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </ModalComponent>
    </>
  );
}