'use client'

import { useState } from "react"
import { ModalComponent } from "../ModalComponent"
import { toast } from "sonner"
import { FiEdit } from "react-icons/fi";

const handleUpdate = async (beritaData, setIsLoading, onSuccess) => {
  setIsLoading(true)
  try{
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/berita/${Number(beritaData.id)}`,
      {
        method: "PUT",
        body: JSON.stringify(beritaData)
      })
    const jsonData = await res.json()
    if (!res.ok) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
    onSuccess()
    toast.success("Berita berhasil diperbarui")
  }catch(err){
    console.error(err.message)
    toast.error(err.message)
  }finally{
    setIsLoading(false)
  }
}

export const UpdateBerita = ({ initialData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [beritaData, setBeritaData] = useState(initialData)

  const onChange = (e) => {
    const {name, value} = e.target
    setBeritaData({
      ...beritaData,
      [name]: value,
    })
  }
  
  const onReset = () => {
    setBeritaData(initialData)
  }
  
  const onSubmit = (e) => {
    e.preventDefault()
    const _onSuccess = () => {
      setIsModalOpen(false)
      window.location.reload()
    }
    handleUpdate({
      ...beritaData,
      publishStart: new Date(beritaData.publishStart).toISOString(),
      publishEnd: new Date(beritaData.publishEnd).toISOString(),
    }, setIsLoading, _onSuccess)
  }
  return (
      <>
        <button
          className="text-sm bg-amber-500 text-white font-bold hover:bg-amber-400 active:bg-amber-600 p-2 rounded-lg transition-colors cursor-pointer"
          aria-label="update date"
          title="Perbarui Tanggal Berita"
          onClick={() => setIsModalOpen(true)}
        >
        <FiEdit size={15} />
        </button>
        <ModalComponent isOpen={isModalOpen}>
          <p className="text-dark-primary text-lg font-semibold mb-4">Perbarui Tanggal Berita</p>
          <form onReset={onReset} onSubmit={onSubmit} className="w-[50vw]">
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-dark-primary/75 font-semibold">Judul Berita: <span className="text-rose-500">*</span></label>
                <input
                  placeholder="Rekrutmen Misdinar 2026"
                  name="title"
                  value={beritaData.title}
                  onChange={onChange}
                  className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                  required
                  disabled={isLoading}
                  />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-dark-primary/75 font-semibold">Bagian: <span className="text-rose-500">*</span></label>
                <input
                  placeholder="Seksi Liturgi"
                  name="section"
                  value={beritaData.section}
                  onChange={onChange}
                  className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                  required
                  disabled={isLoading}
                  />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-dark-primary/75 font-semibold">Deskripsi singkat: <span className="text-rose-500">*</span></label>
                <textarea
                  rows={2}
                  name="descriptions"
                  placeholder="Cth: [section] mengadakan [kegiatan] pada [waktu singkat]. Terima kasih."
                  value={beritaData.descriptions}
                  onChange={onChange}
                  className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                  required
                  disabled={isLoading}
                  />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-dark-primary/75 font-semibold">Detail: <span className="text-rose-500">*</span></label>
                <textarea
                  rows={5}
                  name="details"
                  placeholder="Cth: [section] mengadakan [kegiatan] pada [waktu singkat]. Terima kasih."
                  value={beritaData.details}
                  onChange={onChange}
                  className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                  required
                  disabled={isLoading}
                  />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-dark-primary/75 font-semibold">Tanggal mulai publikasi: <span className="text-rose-500">*</span></label>
                <input
                  name="publishStart"
                  value={beritaData.publishStart}
                  onChange={onChange}
                  className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                  required
                  type="date"
                  disabled={isLoading}
                  />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-dark-primary/75 font-semibold">Tanggal berhenti publikasi: <span className="text-rose-500">*</span></label>
                <input
                  name="publishEnd"
                  value={beritaData.publishEnd}
                  min={beritaData.publishStart}
                  onChange={onChange}
                  className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                  required
                  type="date"
                  disabled={isLoading}
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
  )
}