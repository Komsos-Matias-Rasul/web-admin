'use client'

import { ModalComponent } from "../ModalComponent"
import { toast } from 'sonner'
import { useState } from "react"
import { AiFillEdit } from "react-icons/ai"

const updateEditionInfo = async (data, setIsLoading, onSuccess) => {
  try {
    setIsLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/editions/${data.id}/save-info`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    const jsonData = await res.json()
    if (!res.ok) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
    toast.success("Informasi edisi berhasil diperbarui")
    onSuccess()
  } catch (err) {
    toast.error(err.message)
  } finally {
    setIsLoading(false)
  }
}

export const EditEditionInfoModal = ({ initialData, onSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editionData, setEditionData] = useState(initialData)
  const onReset = () => {
    setEditionData(initialData)
  }
  const onChange = (e) => {
    const {name, value} = e.target
    setEditionData({
      ...editionData,
      [name]: value,
    })
  }
  const onSubmit = (e) => {
    e.preventDefault()
    if (editionData.year < 1970){
      toast.error("Tahun edisi tidak valid")
      return
    }
    const _onSuccess = () => {
      setIsModalOpen(false)
      onSuccess()
    }
    const _data = {
      id: initialData.id,
      title: editionData.title,
      year: Number(editionData.year),
    }
    updateEditionInfo(_data, setIsLoading, _onSuccess)
  }

  return (
    <>
      <button
        className="bg-amber-500 text-white hover:bg-amber-400 active:bg-amber-600 p-2 rounded-lg transition-colors cursor-pointer"
        aria-label="update"
        title="Update info"
        onClick={()=> setIsModalOpen(true)}
        >
          <AiFillEdit size={15} />
      </button>
      <ModalComponent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-dark-primary text-lg font-semibold">Perbarui Informasi Edisi</div>
        <form onReset={onReset} onSubmit={onSubmit} className="w-96">
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-dark-primary/75 font-semibold">Judul Edisi: <span className="text-rose-500">*</span></label>
              <input
                placeholder="Zaitun Edisi Paskah 2013"
                name="title"
                value={editionData.title}
                onChange={onChange}
                className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                required
                disabled={isLoading}
                />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-dark-primary/75 font-semibold">Tahun Edisi: <span className="text-rose-500">*</span></label>
              <input
                placeholder={2013}
                name="year"
                value={editionData.year}
                onChange={onChange}
                className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                required
                type="number"
                disabled={isLoading}
                />
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
        </form>
      </ModalComponent>
    </>
  );
}