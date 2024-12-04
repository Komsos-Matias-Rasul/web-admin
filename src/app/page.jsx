'use client'
import Editor from "@/components/Editor";
import ThumbnailUploader from "@/components/ThumbnailUploader";
import { Button } from "@nextui-org/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io"

const CATEGORIES = [
  {
    key: "laporan_utama",
    label: "Laporan Utama", 
  },
  {
    key: "surat_gembala",
    label: "Surat Gembala", 
  },
  {
    key: "liputan_umum",
    label: "Liputan Umum", 
  },
  {
    key: "inspiratif",
    label: "Inspiratif", 
  },
  {
    key: "serba_serbi",
    label: "Serba Serbi", 
  },
]

const handleSubmit = async (data) => {
  console.log(data)
  const res = await fetch('/api/article/save', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    }
  })

  const jsonData = await res.json()
  console.log(jsonData)
}

export default function Home() {
  const [data, setData] = useState()
  const [selectedCategory, setSelectedCategory] = useState("none")

  return (
    <div className="flex min-h-screen">
      <div className="h-screen fixed flex flex-col px-8 py-4 w-[30%] flex-shrink-0 bg-gradient-to-br from-indigo-600 to-violet-700">
        <button className="text-white text-xl text-left p-4 rounded-lg hover:bg-white/20 hover:shadow-lg transition-all active:bg-black/20 active:scale-95">
          Write Article
        </button>
      </div>
      <div className="w-full p-20 bg-neutral-100 flex flex-row-reverse">
        <div className="w-[70%] flex-shrink-0">
          <h1 className="text-3xl font-semibold text-neutral-500">Hi, Eolia! 👋</h1>
          <div className="flex justify-end items-center gap-4 mb-4">
            <button className="border-2 border-rose-500 px-3 py-1.5 rounded-lg text-rose-500 hover:bg-rose-500 hover:text-white transition-colors">
              Discard
            </button>
            <button onClick={() => handleSubmit(data)} className="border-2 border-sky-500 bg-sky-500 px-3 py-1.5 rounded-lg text-white hover:bg-sky-600 hover:border-sky-600 transition-colors">
              Save Draft
            </button>
          </div>
          <div className="flex gap-2 items-center mb-4">
            <label>Title:<span className="text-rose-500">*</span></label>
            <input type="text" name="title" className="bg-white px-4 py-2 focus:outline-none w-full rounded-lg shadow-lg" placeholder="Add title here"/>
          </div>
          <div className="flex gap-2 items-center mb-4">
            <label>Category:<span className="text-rose-500">*</span></label>
            <Dropdown>
              <DropdownTrigger>
                <Button className="bg-white shadow-lg" endContent={<IoMdArrowDropdown />}
                >
                  {selectedCategory === "none" ? "None" :
                    CATEGORIES.filter(c => c.key === selectedCategory.currentKey)[0].label
                  }
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                className="max-h-48 overflow-auto"
                selectedKeys={selectedCategory}
                selectionMode="single"
                onSelectionChange={setSelectedCategory}
                disabledKeys={["none"]}
              >
                <DropdownItem key="none">None</DropdownItem>
                {
                  CATEGORIES.map((item) => (
                    <DropdownItem key={item.key}>{item.label}</DropdownItem>
                  ))
                }
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="mb-4">
            <ThumbnailUploader />
          </div>
          <div className="bg-white rounded-lg shadow-lg px-16 py-4 w-full">
            <Editor data={data} onChange={setData} editorBlock="editorjs-container"/>
          </div>
        </div>
      </div>
    </div>
  );
}
