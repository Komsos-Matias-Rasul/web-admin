'use client'

import { useState } from "react"
import { ModalComponent } from "../ModalComponent"
import { toast } from "sonner";

const handleRenameArticleCover = async(fileData, setIsLoading, onSuccess) => {
  if(fileData.fileName.trim().length === 0) {
    toast.error("Masukan nama file")
    return
  }
  
  const validExtensions = /\.(png|jpe?g|webp)$/i
  const isExtensionValid = validExtensions.test(fileData.fileName)

  if (!isExtensionValid) {
    toast.error("Nama file tidak valid. Gunakan ekstensi (jpg/jpeg/png/webp)")
    return
  }

  // Checks invalid characters: / \ ? % * : | " < > ^
  const invalidChars = /[\/\\?%*:|"<>^]/
  const isInvalid = invalidChars.test(fileData.fileName)

  if (isInvalid) {
    toast.error("Nama file tidak valid. Jangan gunakan karakter spesial")
    return
  }

  setIsLoading(true)
  try{
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/${Number(fileData.articleId)}/cover/rename`,
      {
        method: "PUT",
        body: JSON.stringify({
          newHeadline: encodeURIComponent(fileData.fileName),
          source: "user-input"
        })
      })
    const jsonData = await res.json()
    if (!res.ok) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
    toast.success("Nama file berhasil diperbarui")
    onSuccess()
  }catch(err){
    console.error(err.message)
    toast.error(err.message)
  }finally{
    setIsLoading(false)
  }
}

const handleRenameEditionCover = async(fileData, setIsLoading, onSuccess) => {
  if(fileData.fileName.trim().length === 0) {
    toast.error("Masukan nama file")
    return
  }
  
  const validExtensions = /\.(png|jpe?g|webp)$/i
  const isExtensionValid = validExtensions.test(fileData.fileName)

  if (!isExtensionValid) {
    toast.error("Nama file tidak valid. Gunakan ekstensi (jpg/jpeg/png/webp)")
    return
  }

  // Checks invalid characters: / \ ? % * : | " < > ^
  const invalidChars = /[\/\\?%*:|"<>^]/
  const isInvalid = invalidChars.test(fileData.fileName)

  if (isInvalid) {
    toast.error("Nama file tidak valid. Jangan gunakan karakter spesial")
    return
  }

  setIsLoading(true)
  try{
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/editions/${Number(fileData.editionId)}/cover/rename`,
      {
        method: "PUT",
        body: JSON.stringify({
          newCover: encodeURIComponent(fileData.fileName),
          source: "user-input"
        })
      })
    const jsonData = await res.json()
    if (!res.ok) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
    toast.success("Nama file berhasil diperbarui")
    onSuccess()
  }catch(err){
    console.error(err.message)
    toast.error(err.message)
  }finally{
    setIsLoading(false)
  }
}

export const RenameModal = ({initialFileName, articleId, editionId, isModalOpen, setIsModalOpen, onSuccess, onClose = () => null}) => {
  const [fileName, setFileName] = useState(initialFileName)
  const [isLoading, setIsLoading] =  useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    const _onSuccess = () => {
      setFileName("")
        setIsModalOpen(false)
        onSuccess()
        onClose()
    }

    if (articleId && editionId) {
      throw new Error("found articleId and editionId. select one.")
    }

    if (articleId) {
      const fileData = {
        articleId,
        fileName,
      }
      handleRenameArticleCover(fileData, setIsLoading, _onSuccess)
      return
    } if (editionId) {
      const fileData = {
        editionId,
        fileName,
      }
      handleRenameEditionCover(fileData, setIsLoading, _onSuccess)
      return
    }

    throw new Error("no given articleId nor editionId. select one.")
  }

  const onReset = () => {
    setFileName(initialFileName)
  }

  return (
    <>
      <ModalComponent isOpen={isModalOpen}>
        <div>
          <p className="text-dark-primary font-bold text-xl mb-4">Perbarui Nama <i>File</i></p>
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
          <form onSubmit={onSubmit} onReset={onReset} className="w-120">
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-dark-primary/75 font-semibold">Nama <i>file</i>: <span className="text-rose-500">*</span></label>
              <input
                placeholder="Zaitun Edisi Paskah 2013"
                value={fileName}
                className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                disabled={isLoading}
                onChange={(e)=>setFileName(e.target.value)}
                required
                />
            </div>
          </div>
          <div className="flex w-full justify-end gap-2 mt-4">
            <button
              className="text-dark-primary/75 font-bold hover:bg-neutral-200 active:bg-neutral-300 px-4 py-2 rounded-lg transition-colors cursor-pointer min-w-28 disabled:text-dark-primary/30 disabled:bg-transparent disabled:cursor-not-allowed"
              aria-label="cancel create edition"
              title="Cancel"
              type="reset"
              onClick={() => {
                setIsModalOpen(false)
                onClose()
              }}
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
            {isLoading ? <div className="flex justify-center items-center w-full"><span className="loader"></span></div> : "Simpan"}
            </button>
          </div>
          </form>
        </div>
      </ModalComponent>
    </>
  )
}