"use client"

import Image from "next/image";
import { FiEdit, FiImage } from "react-icons/fi";
import { RenameModal } from "../articleManager/RenameModal";
import { useState } from "react";
import { UploadCoverModal } from "../articleManager/UploadCoverModal";

export const BeritaTable = ({ data, onChange }) => {
  const [editionId, setEditionId] = useState()
  const [initialFilename, setInitialFilename] = useState("")
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
  const [isUpdateImageModalOpen, setIsUpdateImageModalOpen] = useState(false)
  const onChangeImage = (editionId) => {
    setEditionId(editionId)
    setIsUpdateImageModalOpen(true)
  }
  const onRename = (_editionId, _initialFileName) => {
    setEditionId(_editionId)
    setInitialFilename(_initialFileName)
    setIsRenameModalOpen(true)
  }
  return (
    <>
      <table className="w-full rounded-lg overflow-hidden">
        <thead>
          <tr className="text-white uppercase text-sm bg-blue-primary">
            <th className="py-2 px-8 text-left">Judul</th>
            <th className="py-2 px-8 text-left">Gambar</th>
            <th className="py-2 px-8 text-left">Mulai Publikasi</th>
            <th className="py-2 px-8 text-left">Berhenti Publikasi</th>
            <th className="py-2 px-8 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map(edition => (
                <tr key={edition.key} className="bg-white text-dark-primary">
                  <td className="pl-8 py-4 font-semibold">{edition.title}</td>
                  <td className="pl-8 py-4">
                    <div className="flex gap-2 items-end">
                    <Image
                      src={process.env.NEXT_PUBLIC_GCLOUD_PREFIX + edition.thumbImg}
                      width={100}
                      height={0}
                      className="w-1/2"
                      alt=""
                    />
                    </div>
                  </td>
                  <td className="pl-8 py-4">{edition.publishStart}</td>
                  <td className="pl-8 py-4">{edition.publishEnd}</td>
                  <td className="px-4 py-4">{edition.action}</td>
                </tr>
            ))
          }
        </tbody>
      </table>
      {
        isRenameModalOpen &&
        <RenameModal
          isModalOpen={isRenameModalOpen}
          setIsModalOpen={setIsRenameModalOpen}
          editionId={editionId}
          initialFileName={initialFilename}
          onClose={()=> {
            setEditionId(null)
            setInitialFilename("")
          }}
          onSuccess={onChange}
        />
      }
      {
        isUpdateImageModalOpen &&
        <UploadCoverModal
          editionId={editionId}
          setIsModalOpen={setIsUpdateImageModalOpen}
          isOpen={isUpdateImageModalOpen}
          onClose={() => {
            setEditionId(null)
          }}
          onSuccess={onChange}
        />
      }
    </>
  )
}