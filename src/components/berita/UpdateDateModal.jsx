'use client'

import { useState } from "react"
import { ModalComponent } from "../ModalComponent"
import { toast } from "sonner"
import { FiCalendar } from "react-icons/fi";

const handleUpdate = async (beritaData, setIsLoading, onSuccess) => {
  setIsLoading(true)
  const {id, publishStart, publishEnd} = beritaData
  try{
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/berita/${Number(id)}`,
      {
        method: "PUT",
        body: JSON.stringify({
          publishStart,
          publishEnd,
        })
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
  const [publishStart, setPublishStart] = useState(initialData.publishStart)
  const [publishEnd, setPublishEnd] = useState(initialData.publishEnd)
  const onSubmit = (e) => {
    e.preventDefault()
    const _onSuccess = () => {
      setIsModalOpen(false)
      window.location.reload()
    }
    const updateData = {
      id: initialData.id,
      publishStart: new Date(publishStart).toISOString(),
      publishEnd: new Date(publishEnd).toISOString(),
    }
    handleUpdate(updateData, setIsLoading, _onSuccess)
  }
  return (
      <>
        <button
          className="text-sm bg-amber-500 text-white font-bold hover:bg-amber-400 active:bg-amber-600 p-2 rounded-lg transition-colors cursor-pointer"
          aria-label="update date"
          title="Perbarui Tanggal Berita"
          onClick={() => setIsModalOpen(true)}
        >
        <FiCalendar size={15} />
        </button>
        <ModalComponent isOpen={isModalOpen}>
          <p className="text-dark-primary text-lg font-semibold mb-4">Perbarui Tanggal Berita</p>
          <form onReset={() => setIsModalOpen(false)} onSubmit={onSubmit} className="w-120">
            <div className="flex flex-col gap-4">
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
            <div className="flex w-full justify-end gap-2 mt-4">
              <button
                className="text-dark-primary/75 font-bold hover:bg-neutral-200 active:bg-neutral-300 px-4 py-2 rounded-lg transition-colors cursor-pointer min-w-28 disabled:text-dark-primary/30 disabled:bg-transparent disabled:cursor-not-allowed"
                aria-label="batalkan menghapus berita"
                title="Batalkan"
                type="reset"
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
              >
              Batalkan
              </button>
              <button
                className="text-white font-bold bg-blue-primary hover:bg-blue-400 active:bg-blue-600 px-4 py-2 rounded-lg transition-colors cursor-pointer min-w-28 disabled:bg-blue-primary/30 disabled:cursor-not-allowed"
                aria-label="hapus berita"
                title="Hapus"
                type="submit"
                disabled={isLoading}
              >
              {isLoading ? <div className="flex justify-center items-center w-full"><span className="loader"></span></div> : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </ModalComponent>
      </>
  )
}