"use client"
import { ModalComponent } from "../ModalComponent"
import { toast } from 'sonner'
import { useState } from "react"

export const CreateNewEditionModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editionTitle, setEditionTitle] = useState("")
  const [editionYear, setEditionYear] = useState("")
  const handleReset = () => {
    setEditionTitle("")
    setEditionYear("")
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editionYear < 1970){
      toast.error("Tahun edisi tidak valid")
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/edition`, {
        method: "POST",
        body: JSON.stringify({
          "title": editionTitle,
          "year": Number(editionYear)
        })
      })
      const jsonData = await res.json()
      if (!res.ok) {
        throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
      }
      toast.success("Edisi berhasil ditambahkan")
      setEditionTitle("")
      setEditionYear("")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <button
        className="bg-blue-primary text-white font-bold hover:bg-blue-400 active:bg-sky-700 px-4 py-2 rounded-lg transition-colors cursor-pointer"
        aria-label="create edition"
        title="Create edition"
        onClick={() => setIsModalOpen(true)}
      >
      Create New Edition
      </button>
      <ModalComponent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-dark-primary text-lg font-semibold">Create New Edition</div>
        <form onReset={handleReset} onSubmit={handleSubmit} className="w-96">
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-dark-primary/75 font-semibold">Judul Edisi: <span className="text-rose-500">*</span></label>
              <input
                placeholder="Zaitun Edisi Paskah 2013"
                value={editionTitle}
                onChange={(e) => setEditionTitle(e.target.value)}
                className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                required
                disabled={isLoading}
                />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-dark-primary/75 font-semibold">Tahun Edisi: <span className="text-rose-500">*</span></label>
              <input
                placeholder={2013}
                value={editionYear}
                onChange={(e) => setEditionYear(e.target.value)}
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