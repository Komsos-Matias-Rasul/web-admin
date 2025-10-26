'use client'

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";

export const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

  const handleSubmit = async (articleData, setIsLoading, setLastUpdate) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/${Number(articleData.id)}/save-draft`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: articleData.contents
          }),
        })
      const jsonData = await res.json()
      if (!res.ok) {
        throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
      };
      const { data } = jsonData
      const lastUpdate = new Date(data.updatedAt).toLocaleString('id-US', {
        dateStyle: 'long',
        timeStyle: 'short',
      })
      setLastUpdate(lastUpdate)
      toast.success("Draft artikel berhasil disimpan")
    } catch (err) {
      console.error(err);
      toast.error(err.message)
    } finally {
      setIsLoading(false);
    }
  };

const WriteArticle = ({ articleContents, articleId, articleLastUpdate }) => {
  const [contents, setContents] = useState(articleContents);
  const [lastUpdate, setLastUpdate] = useState(articleLastUpdate)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(contents)
  }, [contents])
  
  const onSubmit = (e) => {
    e.preventDefault()
    const articleData = {
      id: articleId,
      contents: contents,
    }
    handleSubmit(articleData, setIsLoading, setLastUpdate)
  }

  return (
    <>
      <div className="flex justify-end items-center gap-4 mb-4">
        <p className="text-sm text-dark-primary/50 italic">Terakhir disimpan: {lastUpdate}</p>
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className={
            `flex items-center w-fit gap-1 bg-blue-primary text-white
            font-bold hover:bg-blue-400 active:bg-blue-600 px-4 py-2
            rounded-lg transition-colors cursor-pointer disabled:bg-blue-primary/30
            disabled:cursor-not-allowed`
          }
        >
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          )}
          Simpan Perubahan
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg px-16 py-4 w-full mb-8">
        <Editor 
          data={contents} 
          onContentChange={(updatedContent) => {
            setContents(prev => ({ ...prev, ...updatedContent }))
          }}
          editorBlock="editorjs-container" 
        />
      </div>
    </>
  );
};

export default WriteArticle;