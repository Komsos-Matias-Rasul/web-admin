'use client'
import { useState } from "react"
import { ModalComponent } from "../ModalComponent"
import { FaCheck } from "react-icons/fa"
import { toast } from "sonner"

export const PublishEdition = ({editionId}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/editions/publish/${editionId}`, {
        method: "PUT",
      })
      const jsonData = await res.json()
      if (!res.ok) {
        throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
      }
      toast.success("Edisi berhasil diterbitkan")
      setIsModalOpen(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <>
        <button
          className="bg-emerald-500 text-white hover:bg-emerald-400 active:bg-emerald-600 p-2 rounded-lg transition-colors cursor-pointer"
          aria-label="publish"
          title="Publish edition"
          onClick={() => setIsModalOpen(true)}
          >
            <FaCheck size={15} />
        </button>
        <ModalComponent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="text-dark-primary text-lg font-semibold">Publikasi Edisi</div>
          <div className="w-96">
            <p className="text-dark-primary/75 mt-4">Tekan tombol &quot;Lanjutkan&quot; untuk membuat edisi ini dapat diakses oleh publik.</p>
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
                onClick={handleSubmit}
                disabled={isLoading}
              >
              {isLoading ? <div className="flex justify-center items-center w-full"><span className="loader"></span></div> : "Publikasi"}
              </button>
            </div>
          </div>
        </ModalComponent>
      </>
    );
}