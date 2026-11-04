"use client"

import Image from "next/image";
import { FiEdit, FiEye, FiImage } from "react-icons/fi";
import { RenameModal } from "../articleManager/RenameModal";
import { useState } from "react";
import { UploadCoverModal } from "../articleManager/UploadCoverModal";
import { EditEditionInfoModal } from "./EditEditionInfoModal";
import { RiBookletFill } from "react-icons/ri";
import Link from "next/link";
import { PublishEdition } from "./PublishEdition";

export const EditionsTable = ({ data, onChange }) => {
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
            <th className="py-2 px-8 text-left">Title</th>
            <th className="py-2 px-8 text-left">Cover</th>
            <th className="py-2 px-8 text-left">Publish Date</th>
            <th className="py-2 px-8">Action</th>
            <th className="py-2 px-8">Status</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map(edition => (
                <tr key={edition.id} className="bg-white text-dark-primary">
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
                      <div className="flex flex-col gap-1">
                        <button
                          id={edition.key}
                          type="button"
                          className="text-white p-1 bg-blue-500 rounded hover:bg-blue-400 cursor-pointer"
                          onClick={() => onChangeImage(edition.key)}
                        >
                          <FiImage />
                        </button>
                        <button
                          id={edition.key}
                          type="button"
                          value={edition.coverImg}
                          onClick={() => onRename(edition.key, edition.coverImg)}
                          className="text-white p-1 bg-amber-500 rounded hover:bg-amber-400 cursor-pointer"
                        >
                          <FiEdit />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="pl-8 py-4">{edition.publishedAt}</td>
                  <td className="px-4 py-4">
                  <div className="flex gap-2 justify-center">
                      <EditEditionInfoModal initialData={edition} onSuccess={onChange} />
                      <Link href={`/admin/editions/${edition.id}/articles`}>
                        <button
                          className="bg-sky-700 text-white hover:bg-sky-600 active:bg-sky-800 p-2 rounded-lg transition-colors cursor-pointer"
                          aria-label="manage"
                          title="Manage articles"
                          >
                            <RiBookletFill size={15} />
                        </button>
                      </Link>
                      {
                        edition.publishedAt === null &&
                        <PublishEdition editionId={edition.id} editionTitle={edition.title} onSuccess={onChange} />
                      }
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {
                      edition.status &&
                      <div className="flex justify-center">
                        <div
                          className="flex items-center px-2 py-1 text-xs font-semibold text-blue-primary border-2 border-blue-primary rounded-full w-fit gap-1"
                          title="currently active"
                          >
                          <FiEye size={15} />
                          <label>ACTIVE</label>
                        </div>
                      </div>
                    }
                  </td>
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