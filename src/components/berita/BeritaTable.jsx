"use client"

import Image from "next/image";
import { UpdateBerita } from "./UpdateDateModal";
import { DeleteBerita } from "./DeleteBerita";

export const BeritaTable = ({ data, onSuccess }) => {
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
            data.map(berita => (
                <tr key={berita.id} className="bg-white text-dark-primary even:bg-slate-100">
                  <td className="pl-8 py-4 font-semibold">{berita.title}</td>
                  <td className="pl-8 py-4">
                    <div className="flex gap-2 items-end">
                    <Image
                      src={process.env.NEXT_PUBLIC_GCLOUD_PREFIX + berita.thumbImg}
                      width={100}
                      height={0}
                      className="w-1/2"
                      alt=""
                    />
                    </div>
                  </td>
                  <td className="pl-8 py-4">{new Date(berita.publishStart).toLocaleString('id-US', {
                        dateStyle:'medium',
                      })}</td>
                  <td className="pl-8 py-4">{new Date(berita.publishEnd).toLocaleString('id-US', {
                        dateStyle:'medium',
                      })}</td>
                  <td className="px-4 py-4">
                  <div className="flex gap-2 justify-center items-center">
                    <UpdateBerita initialData={berita} onSuccess={onSuccess} />
                    <DeleteBerita beritaId={berita.id} beritaTitle={berita.title} onSuccess={onSuccess} />
                  </div>
                  </td>
                </tr>
            ))
          }
        </tbody>
      </table>
    </>
  )
}