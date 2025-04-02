'use client'
import ThumbnailUploader from "@/components/ThumbnailUploader";
import { Button } from "@heroui/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io"
import dynamic from "next/dynamic";

export const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
})

const handleSubmit = async ({title, thumbnail, category, content, writer}) => {
  if (!title || !thumbnail || !content || category === "none") {
    alert("Please fill out the required fields")
    return
  }
  const thumbImg = new FormData()
  thumbImg.append('thumbnail', thumbnail)
  
  const articleData = {
    title,
    category: Number(category.currentKey),
    content,
    writer,
  }
  let slug
  try{
    const res = await fetch("/api/articles/save", {
      method: "POST",
      body: JSON.stringify(articleData),
      headers: {
        "Content-Type": "application/json",
      }
    })
    const data = await res.json()
    slug = data.slug
  } catch (err) {
    console.error(err)
    return
  }
  
  try{
    await fetch(`/api/img/thumbnail/save?slug=${slug}`, {
      method: "POST",
      body: thumbImg,
    })
  } catch (err) {
    console.error(err)
  }

}

const WriteArticle = ({categories, dataContent, dataThumbnail, dataTitle="", dataWriter="", dataCategory}) => {
  const [data, setData] = useState(dataContent)
  const [thumbnail, setThumbnail] = useState(dataThumbnail)
  const [articleTitle, setArticleTitle] = useState(dataTitle)
  const [articleWriter, setArticleWriter] = useState(dataWriter)
  const [selectedCategory, setSelectedCategory] = useState(dataCategory)

  return (
      <>
        <div className="flex justify-end items-center gap-4 mb-4">
          <button onClick={() => handleSubmit({
            title: articleTitle,
            writer: articleWriter,
            thumbnail: thumbnail,
            category: selectedCategory,
            content: data,
          })} className="border-2 border-sky-500 bg-sky-500 px-3 py-1.5 rounded-lg text-white hover:bg-sky-600 hover:border-sky-600 transition-colors">
            Save Draft
          </button>
        </div>
        {/* <div className="flex gap-2 items-center mb-4">
          <label>Category:<span className="text-rose-500">*</span></label>
          <Dropdown>
            <DropdownTrigger>
              <Button className="bg-white shadow-lg" endContent={<IoMdArrowDropdown />}
              >
                {
                  selectedCategory.currentKey ? categories.filter(c => c.id === Number(selectedCategory.currentKey))[0].label :
                  categories.filter(c => c.id === Number(selectedCategory))[0]?.label || "Uncategorized"
                }
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              className="max-h-48 overflow-auto"
              selectedKeys={selectedCategory}
              selectionMode="single"
              onSelectionChange={setSelectedCategory}
              >
              {
                categories.map((item) => <DropdownItem key={item.id}>{item.label}</DropdownItem>)
              }
            </DropdownMenu>
          </Dropdown>
        </div> */}
        {/* <div className="mb-4">
          <ThumbnailUploader thumbnail={thumbnail} setThumbnail={setThumbnail}/>
        </div> */}
        <div className="bg-white rounded-lg shadow-lg px-16 py-4 w-full mb-8">
          <Editor data={data} onChange={setData} editorBlock="editorjs-container"/>
        </div>
    </>
  );
}

export default WriteArticle