"use client"

import { useState } from "react"
import { FiPlus } from "react-icons/fi"
import { ModalComponent } from "../ModalComponent"
import { toast } from "sonner"

const handleSubmit = async (data, setIsLoading, onSuccess) => {
  setIsLoading(true)
  try{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/category`, {
      method: "POST",
      body: JSON.stringify({
        "category": data.categoryName,
        "editionId": data.editionId,
      })
    })
    const jsonData = await res.json()
    if (!res.ok) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
    toast.success("Kategori berhasil ditambahkan")
    onSuccess()
  } catch (err) {
    console.error(err)
    toast.error(err.message)
  }
  finally{
    setIsLoading(false)
  }
}

export const AddCategoryModal = ({editionId, isOpen, setIsOpen, mutateCategories}) => {
  const [categoryName, setCategoryName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const onReset = () => {
    setCategoryName("")
  }

  const onSuccess = () => {
    setCategoryName("")
    setIsOpen(false)
    mutateCategories()
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const data = {
      categoryName,
      editionId
    }
    handleSubmit(data, setIsLoading, onSuccess)
  }

  return (
    <>
      <ModalComponent isOpen={isOpen}>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FiPlus className="text-dark-primary"/>
            <p className="text-dark-primary font-bold text-xl">Tambah Kategori</p>
          </div>
          <form onReset={onReset} onSubmit={onSubmit} className="w-96">
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-dark-primary/75 font-semibold">Kategori: <span className="text-rose-500">*</span></label>
              <input
                placeholder="Farhan Kebab"
                value={categoryName}
                className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                disabled={isLoading}
                onChange={(e)=>setCategoryName(e.target.value)}
                required
                />
            </div>
          </div>
          <div className="flex w-full justify-end gap-2 mt-4">
            <button
              className="text-dark-primary/75 font-bold hover:bg-neutral-200 active:bg-neutral-300 px-4 py-2 rounded-lg transition-colors cursor-pointer min-w-28 disabled:text-dark-primary/30 disabled:bg-transparent disabled:cursor-not-allowed"
              aria-label="cancel create category"
              title="Cancel"
              type="reset"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
            Cancel
            </button>
            <button
              className="text-white font-bold bg-blue-primary hover:bg-blue-400 active:bg-blue-600 px-4 py-2 rounded-lg transition-colors cursor-pointer min-w-28 disabled:bg-blue-primary/30 disabled:cursor-not-allowed"
              aria-label="create new category"
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
)}