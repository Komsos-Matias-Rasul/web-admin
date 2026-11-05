"use client"

import { useEffect, useMemo, useState } from "react"
import { FiArrowDown, FiArrowUp, FiRotateCcw } from "react-icons/fi"
import { RxDragHandleDots2 } from "react-icons/rx"
import { toast } from "sonner"
import useSWR from "swr"

const fetchCategories = async (endpoint) => {
  const res = await fetch(endpoint)
  if (!res.ok) {
    const jsonData = await res.json().catch(() => null)
    const reason = jsonData?.data?.error ?? res.statusText
    const traceId = jsonData?._id ? ` (${jsonData._id})` : ""
    throw new Error(`${res.status} ${reason}${traceId}`)
  }
  const { data } = await res.json()
  const categories = (data?.categories ?? [])
    .map((category) => ({
      id: category.id,
      label: category.label,
      order: Number(category.order) || 0,
    }))
    .sort((a, b) => a.order - b.order || a.id - b.id)

  return categories
}

const saveCategoryOrders = async (changedItems) => {
  const responses = await Promise.all(
    changedItems.map((item) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/category`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Number(item.id),
          newOrder: Number(item.order),
        }),
      })
    )
  )

  await Promise.all(
    responses.map(async (res) => {
      if (!res.ok) {
        const jsonData = await res.json().catch(() => null)
        const reason = jsonData?.data?.error ?? res.statusText
        const traceId = jsonData?._id ? ` (${jsonData._id})` : ""
        throw new Error(`${res.status} ${reason}${traceId}`)
      }
    })
  )
}

export const CategoriesTable = ({ editionId }) => {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/categories/by-edition/${editionId}/active`,
    fetchCategories
  )

  const [items, setItems] = useState([])
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (data) {
      setItems(data.map((cat) => ({ ...cat })))
    }
  }, [data])

  const initialOrderById = useMemo(() => {
    const map = new Map()
    ;(data ?? []).forEach((cat) => map.set(cat.id, cat.order))
    return map
  }, [data])

  const changedItems = useMemo(
    () => items.filter((item) => initialOrderById.get(item.id) !== Number(item.order)),
    [items, initialOrderById]
  )

  const isDirty = changedItems.length > 0

  const reorderAndNumber = (list) =>
    list.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }))

  const moveItem = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= items.length || fromIndex === toIndex) return
    const updated = [...items]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setItems(reorderAndNumber(updated))
  }

  const handleReset = () => {
    if (data) {
      setItems(data.map((cat) => ({ ...cat })))
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!isDirty || isSaving) return

    setIsSaving(true)
    try {
      await saveCategoryOrders(changedItems)
      await mutate()
      toast.success("Urutan kategori berhasil diperbarui")
    } catch (err) {
      console.error(err)
      toast.error(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mt-8 text-amber-600 bg-amber-200 border border-amber-600/50 px-8 py-4 rounded-lg animate-pulse">
        Loading category order . . .
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8 text-rose-600 bg-rose-200 border border-rose-600/50 px-8 py-4 rounded-lg">
        {error.message}
      </div>
    )
  }

  return (
    <section className="mt-10">
      <form onSubmit={onSubmit}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-dark-primary">Urutan Tampilan Kategori</h2>
            <p className="text-sm text-dark-primary/70">
              Geser baris atau gunakan tombol panah untuk mengatur urutan kategori di halaman utama.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isDirty && (
              <span className="text-xs font-semibold text-amber-600 bg-amber-100 border border-amber-400 px-2.5 py-1 rounded-full">
                Belum disimpan
              </span>
            )}
            {isDirty && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="flex items-center gap-1.5 text-sm font-bold text-dark-primary/75 bg-white hover:bg-neutral-100 active:bg-neutral-200 px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Kembalikan urutan awal"
              >
                <FiRotateCcw size={14} />
                Reset
              </button>
            )}
            <button
              type="submit"
              disabled={!isDirty || isSaving}
              className="flex items-center justify-center gap-2 text-sm font-bold bg-blue-primary text-white hover:bg-blue-400 active:bg-blue-600 px-4 py-2 rounded-lg transition-colors cursor-pointer min-w-36 disabled:bg-blue-primary/30 disabled:cursor-not-allowed"
              aria-label="simpan urutan kategori"
              title="Simpan urutan kategori"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : null}
              Simpan Urutan
            </button>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden shadow-xs">
          <table className="w-full">
            <thead>
              <tr className="text-white uppercase text-sm bg-blue-primary">
                <th className="py-2.5 px-6 text-left">Nama Kategori</th>
                <th className="py-2.5 px-6 text-center w-36">Atur Posisi</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr className="bg-white text-dark-primary/60">
                  <td colSpan={2} className="py-8 px-6 text-center italic">
                    Belum ada kategori aktif pada edisi ini.
                  </td>
                </tr>
              ) : (
                items.map((cat, idx) => {
                  const isDragOver = dragOverIndex === idx && draggedIndex !== idx

                  return (
                    <tr
                      key={cat.id}
                      draggable={!isSaving}
                      onDragStart={() => setDraggedIndex(idx)}
                      onDragOver={(e) => {
                        e.preventDefault()
                        if (dragOverIndex !== idx) setDragOverIndex(idx)
                      }}
                      onDragLeave={() => {
                        if (dragOverIndex === idx) setDragOverIndex(null)
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        if (draggedIndex !== null && draggedIndex !== idx) {
                          moveItem(draggedIndex, idx)
                        }
                        setDraggedIndex(null)
                        setDragOverIndex(null)
                      }}
                      onDragEnd={() => {
                        setDraggedIndex(null)
                        setDragOverIndex(null)
                      }}
                      className={`bg-white even:bg-slate-50 text-dark-primary border-b border-slate-200/80 last:border-b-0 transition-colors ${
                        isDragOver ? "ring-2 ring-inset ring-blue-primary bg-blue-50/60" : ""
                      } ${draggedIndex === idx ? "opacity-50" : ""}`}
                    >
                      <td className="py-3.5 px-6 font-semibold">
                        <div className="flex items-center gap-3">
                          <span
                            className="text-dark-primary/40 hover:text-dark-primary cursor-grab active:cursor-grabbing"
                            title="Geser untuk mengubah urutan"
                          >
                            <RxDragHandleDots2 size={18} />
                          </span>
                          <span>{cat.label}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-6">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => moveItem(idx, idx - 1)}
                            disabled={idx === 0 || isSaving}
                            className="p-2 rounded-lg bg-slate-100 text-dark-primary hover:bg-blue-primary hover:text-white transition-colors cursor-pointer disabled:opacity-35 disabled:hover:bg-slate-100 disabled:hover:text-dark-primary disabled:cursor-not-allowed"
                            aria-label={`Geser ${cat.label} ke atas`}
                            title="Geser ke atas"
                          >
                            <FiArrowUp size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(idx, idx + 1)}
                            disabled={idx === items.length - 1 || isSaving}
                            className="p-2 rounded-lg bg-slate-100 text-dark-primary hover:bg-blue-primary hover:text-white transition-colors cursor-pointer disabled:opacity-35 disabled:hover:bg-slate-100 disabled:hover:text-dark-primary disabled:cursor-not-allowed"
                            aria-label={`Geser ${cat.label} ke bawah`}
                            title="Geser ke bawah"
                          >
                            <FiArrowDown size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </form>
    </section>
  )
}
