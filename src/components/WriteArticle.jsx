'use client'

import { useState } from "react";
import dynamic from "next/dynamic";

export const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

const handleSubmit = async (articleData, IDData) => {
  console.log("Submitting article data:");
  if (!articleData?.content) {
    alert("Please fill out the required fields");
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/saveDraft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({articleData, IDData}),
    });

    if (!res.ok) throw new Error("Failed to save");

    const data = await res.json();
    console.log("Saved successfully:", data);
  } catch (err) {
    console.error("Error saving article:", err);
  }
};

const WriteArticle = ({ dataContent , dataID}) => {
  const [dataArticle, setData] = useState(dataContent);
  return (
    <>
      <div className="flex justify-end items-center gap-4 mb-4">
        <button
          onClick={() => handleSubmit(dataArticle, dataID)}
          className="border-2 border-sky-500 bg-sky-500 px-3 py-1.5 rounded-lg text-white hover:bg-sky-600 hover:border-sky-600 transition-colors"
        >
          Save Draft
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg px-16 py-4 w-full mb-8">
        <Editor data={dataArticle} onChange={(updatedContent) => {
          setData(prev => ({ ...prev, content: updatedContent }))
        }} editorBlock="editorjs-container" />
      </div>
    </>
  );
};

export default WriteArticle;
