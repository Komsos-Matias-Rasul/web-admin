'use client'
import AdsUploader from "@/components/AdsUploader";
import Editor from "@/components/Editor";
import ThumbnailUploader from "@/components/ThumbnailUploader";
import { Button } from "@nextui-org/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io"

const handleSubmit = async ({title, thumbnail, category, content, ads, writer}) => {
  if (!title || !thumbnail || !content || category === "none") {
    alert("Please fill out the required fields")
    return
  }
  const thumbImg = new FormData()
  thumbImg.append('thumbnail', thumbnail)
  
  const {adV1, adV2, adV3, adH} = ads

  const adImage = new FormData()
  if (adV1) adImage.append('adV1', adV1)
  if (adV2) adImage.append('adV2', adV2)
  if (adV3) adImage.append('adV3', adV3)
  if (adH) adImage.append('adH', adH)

  
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

export default function Home() {
  const [data, setData] = useState()
  const [selectedCategory, setSelectedCategory] = useState("none")
  const [thumbnail, setThumbnail] = useState(null)
  const [articleTitle, setArticleTitle] = useState("")
  const [articleWriter, setArticleWriter] = useState("")
  const [ads, setAds] = useState({
    adV1: null,
    adV2: null,
    adV3: null,
    adH1: null,
  })
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data)
    }
    fetchCategories()
  }, [])

  return (
    <div className="flex min-h-screen">
      <div className="h-screen fixed flex flex-col px-8 py-4 w-[30%] flex-shrink-0 bg-gradient-to-br from-indigo-600 to-violet-700">
        <button className="text-white text-xl text-left p-4 rounded-lg hover:bg-white/20 hover:shadow-lg transition-all active:bg-black/20 active:scale-95">
          Write Article
        </button>
        <button className="text-white text-xl text-left p-4 rounded-lg hover:bg-white/20 hover:shadow-lg transition-all active:bg-black/20 active:scale-95">
          Draft
        </button>
      </div>
      <div className="w-full p-20 bg-neutral-100 flex flex-row-reverse">
        <div className="w-[70%] flex-shrink-0">
          <h1 className="text-3xl font-semibold text-neutral-500">Hi, Eolia! 👋</h1>
          <div className="flex justify-end items-center gap-4 mb-4">
            <button className="border-2 border-rose-500 px-3 py-1.5 rounded-lg text-rose-500 hover:bg-rose-500 hover:text-white transition-colors">
              Discard
            </button>
            <button onClick={() => handleSubmit({
              title: articleTitle,
              writer: articleWriter,
              thumbnail: thumbnail,
              category: selectedCategory,
              content: data,
              ads: ads,
            })} className="border-2 border-sky-500 bg-sky-500 px-3 py-1.5 rounded-lg text-white hover:bg-sky-600 hover:border-sky-600 transition-colors">
              Save Draft
            </button>
          </div>
          <div className="flex gap-2 items-center mb-4">
            <label>Title:<span className="text-rose-500">*</span></label>
            <input
              type="text"
              name="title"
              value={articleTitle}
              onChange={(e) => setArticleTitle(e.target.value)}
              className="bg-white px-4 py-2 focus:outline-none w-full rounded-lg shadow-lg" placeholder="Add title here"/>
          </div>
          <div className="flex gap-2 items-center mb-4">
            <label>Writer:<span className="text-rose-500">*</span></label>
            <input
              type="text"
              name="writer"
              value={articleWriter}
              onChange={(e) => setArticleWriter(e.target.value)}
              className="bg-white px-4 py-2 focus:outline-none w-1/2 rounded-lg shadow-lg" placeholder="Enter writer name"/>
          </div>
          <div className="flex gap-2 items-center mb-4">
            <label>Category:<span className="text-rose-500">*</span></label>
            <Dropdown>
              <DropdownTrigger>
                <Button className="bg-white shadow-lg" endContent={<IoMdArrowDropdown />}
                >
                  {selectedCategory === "none" ? "None" :
                    categories.filter(c => c.id === Number(selectedCategory.currentKey))[0].label
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
                  categories.map((item) => (
                    <DropdownItem key={item.id}>{item.label}</DropdownItem>
                  ))
                }
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="mb-4">
            <ThumbnailUploader thumbnail={thumbnail} setThumbnail={setThumbnail}/>
          </div>
          <div className="bg-white rounded-lg shadow-lg px-16 py-4 w-full mb-8">
            <Editor data={data} onChange={setData} editorBlock="editorjs-container"/>
          </div>
          <div className="w-full">
            <AdsUploader ads={ads} setAds={setAds} />
          </div>
        </div>
      </div>
    </div>
  );
}
