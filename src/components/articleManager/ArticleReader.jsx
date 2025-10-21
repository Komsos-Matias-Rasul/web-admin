'use client'
import Image from "next/image";
import Link from "next/link"
import { FiArrowUpRight } from "react-icons/fi";
import useSWR from "swr";

const BlockTypeChip = ({type}) => <span className="z-100 select-none bg-slate-200 text-slate-600 rounded-full px-3 mt-1 absolute invisible scale-75 peer-hover:scale-100 peer-hover:visible right-0 transition-transform">{type}</span>

const parseJSONContents = (contents) => {
  return contents.blocks.map((block) => {
    if (block.type === "quote") {
      return (
        <div key={block.id} className="relative mb-8">
          <div className="border-l-2 border-xmas-tertiary/25 pb-4 hover:bg-emerald-500/15 transition-colors peer">
            <div className="text-dark-primary/80 text-lg pl-8 italic leading-loose" dangerouslySetInnerHTML={{__html: block.data.text}}></div>
          </div>
          <BlockTypeChip type={block.type} />
        </div>
      ) 
    }
    if (block.type === 'paragraph') {
      return (
        <div key={block.id} className="mb-8 relative">
          <div className="text-dark-primary/80 text-lg leading-loose hover:bg-emerald-500/15 transition-colors peer" dangerouslySetInnerHTML={{__html: block.data.text}}></div>
          <BlockTypeChip type={block.type} />
        </div>
      )
    }
    if (block.type === 'image') {
      return (
        <div key={block.id} className="my-8 relative">
          <Image
            src={block.data.file.url}
            alt={block.data.caption}
            sizes="(max-width: 768px) 100vw, 50vw"
            height={0}
            width={200}
            className="w-full peer" />
          <p className="italic mt-4 text-blue-primary font-semibold peer-hover:bg-emerald-500/15 transition-colors">{block.data.caption}</p>
          <BlockTypeChip type={block.type} />
        </div>
      )
    }
    if (block.type === "list") {
      return (
        <ul key={block.id} className={"hover:bg-emerald-500/15 transition-colors pl-8 list-outside mb-4 " + (block.data.style === "unordered" ? " list-disc" : " list-decimal")}>
            {
              block.data.items.map((listItem, i) => <li key={i} className="text-dark-primary text-lg leading-loose" dangerouslySetInnerHTML={{__html: listItem.content}} />)
            }
        </ul>
      )
    }
    if (block.type === "header") {
      return (
        <div key={block.id} className="relative mb-4">
          <h3 className="text-dark-primary text-lg lg:text-xl font-bold hover:bg-emerald-500/15 transition-colors peer">{block.data.text}</h3>
          <BlockTypeChip type={`h${block.data.level}`} />
        </div>
      )
    }
  })
}

const contentFetcher = async (endpoint) => {
  const res = await fetch(endpoint)
  if (!res.ok) {
    const jsonData = await res.json()
    if (jsonData) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
  }
  const { data } = await res.json()
  const contentsJson = JSON.parse(data.contents)
  let contents
  if (!!contentsJson) {
    contents = parseJSONContents(contentsJson)
  } 

  const readerData = {
    id: data.id,
    contents
  }

  return readerData
}

export const ArticleReader = ({articleId}) => {
  const {data, isLoading, error} = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/${articleId}/contents`, contentFetcher)
  
  return (
    <div className="flex flex-col w-full gap-4 bg-white p-4 rounded-lg">
      <Link
        href={`/admin/editor/${articleId}`}
        className="flex items-center w-fit gap-1 bg-blue-primary text-white font-bold hover:bg-blue-400 active:bg-blue-600 px-4 py-2 rounded-lg transition-colors cursor-pointer"
        aria-label="write"
        title="Tulis artikel"
      >
        <p>Pergi ke Mode Edit</p>
        <FiArrowUpRight size={25} />
      </Link>
      <p className="text-dark-primary text-2xl font-bold">Preview</p>
      {
        isLoading ? (
          <div className="text-amber-600 bg-amber-200 border border-amber-600/50 px-4 py-2 rounded-lg animate-pulse">
            Memuat informasi ...
          </div>
        )
        : error ? (
          <div className="text-rose-600 bg-rose-200 border border-rose-600/50 px-4 py-2 rounded-lg">
            {error.message}
          </div>
        )
        : (
          <div>{data.contents}</div>
        )
      }
    </div>
  )
}