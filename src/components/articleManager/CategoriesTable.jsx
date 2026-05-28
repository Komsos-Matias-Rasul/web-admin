"use client"

import { useState } from "react"
import { toast } from "sonner"
import useSWR from "swr"

const fetchCategories = async (endpoint) => {
  const res = await fetch(endpoint)
  if (!res.ok) {
    const jsonData = await res.json()
    if (jsonData) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
  }
  const { data } = await res.json()
  const categories = data.categories.map(category => ({
    id: category.id,
    label: category.label,
    order: category.order,
  }))

  let orderMapping = {}

  categories.forEach(cat => {
    orderMapping = {...orderMapping, [cat.id]: cat.order}
  })

  return {categories, orderMapping}
}

const updateCategoryOrder = async (orderMap, setIsLoading) => {
  setIsLoading(true)
  const promises = []
  Object.entries(orderMap).forEach(([key, value]) => {
    const prom = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/category`, {
      method: "PUT",
      body: JSON.stringify({
        "id": Number(key),
        "newOrder": Number(value),
      }),
    })
    promises.push(prom)
  });

  try{
    const responses = await Promise.all(promises)
    responses.forEach(async (res) => {
      const jsonData = await res.json()
      if (!res.ok) {
        throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
      }
    })
    toast.success("Urutan kategori berhasil diperbarui")
  } catch (err) {
    console.error(err)
    toast.error(err.message)
  }
  finally{
    setIsLoading(false)
  }
}

export const CategoriesTable = ({ editionId }) => {
  const { data, error, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/categories/by-edition/${editionId}/active`, fetchCategories)
  const [orderMap, setOrderMap] = useState(data?.orderMapping)
  const [isOrderUpdateLoading, setIsOrderUpdateLoading] = useState(false)

  if (isLoading) return 
  if (error) return (
    <div className="mt-8 text-rose-600 bg-rose-200 border border-rose-600/50 px-8 py-4 rounded-lg">
      {error.message}
    </div>
  )

  const onSubmit = (e) => {
    e.preventDefault()
    if (!orderMap) return
    updateCategoryOrder(orderMap, setIsOrderUpdateLoading)
  }

  return (
    <form onSubmit={onSubmit} className="text-dark-primary mt-8 w-2/3 flex flex-col p-2 bg-white rounded-lg">
      <div className="flex mb-4">
        <p className="font-bold w-full">Kategori</p>
        <p className="font-bold w-full">Urutan</p>
      </div>
      {data.categories.map(cat => (
        <div key={cat.id} className="flex py-2 border-b border-slate-300">
          <label className="w-1/2">{cat.label}</label>
          <input
          type="number"
          name={cat.id} defaultValue={cat.order}
          onChange={(e) => setOrderMap({...orderMap, [e.target.name]: e.target.value})}
          className="bg-slate-100 w-16 p-1 rounded"/>
        </div>
      ))}
        <button
        disabled={isOrderUpdateLoading}
        className="mt-6 w-fit text-sm font-semibold bg-blue-primary text-white hover:bg-blue-400 active:bg-blue-600 px-3 py-1 rounded-lg transition-colors cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
        aria-label="write"
        title="Write articles"
      >
        {isOrderUpdateLoading ? <div className="flex justify-center items-center w-full"><span className="border-2 size-5 border-r-0 border-slate-100 animate-spin rounded-full"></span></div> : "Simpan"}
      </button>
    </form>
  )
}