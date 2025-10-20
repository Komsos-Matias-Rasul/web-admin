'use client'

import { useState } from "react"
import { FiSettings } from "react-icons/fi";
import { ModalComponent } from "../ModalComponent"
import Link from "next/link";

export const UpdateImageFileNameModal = ({fullPath, initialFileName, fileExt}) => {
  const [fileName, setFileName] = useState(initialFileName)
  const [isModalOpen, setIsModalOpen] =  useState(false)
  const [isLoading, setIsLoading] =  useState(false)

  return (
    <>
      <div className="flex flex-col mt-4">
        <div className="flex gap-2">
          <label className="text-dark-secondary font-semibold">Nama <i>file</i>:</label>
          <button
            title="Update filename"
            className="px-2 text-sm rounded text-white bg-blue-primary hover:bg-blue hover:bg-blue-400 active:bg-blue-600 transition-colors cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Perbarui
          </button>
        </div>
        <Link
          target="_blank"
          href={process.env.NEXT_PUBLIC_GCLOUD_PREFIX + fullPath}
          title="Open image"
          className="text-dark-primary/80 text-sm hover:text-blue-primary hover:underline">{`${fileName}.${fileExt}`}&#8690;</Link>
      </div>
      <ModalComponent isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div>
          <p className="text-dark-primary font-bold text-xl mb-4">Perbarui Nama <i>File</i></p>
          <form className="w-[30rem]">
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
            {isLoading ? <div className="flex justify-center items-center w-full"><span className="loader"></span></div> : "Simpan"}
            </button>
          </div>
          </form>
        </div>
      </ModalComponent>
    </>
  )
}