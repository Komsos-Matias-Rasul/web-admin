'use client'

import { useState } from "react";
import dynamic from "next/dynamic";

export const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

const WriteArticle = ({ dataContent, dataID }) => {
  const [dataArticle, setData] = useState(dataContent);
  const [originalData, setOriginalData] = useState(dataContent); 
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState(""); 
  
  const hasUnsavedChanges = JSON.stringify(dataArticle) !== JSON.stringify(originalData);

  const handleSubmit = async (articleData, IDData) => {
    console.log("Submitting article data:");
    if (!articleData?.content) {
      setResponseMessage("Please fill out the required fields");
      setResponseType("error");
      return;
    }

    setIsLoading(true);
    setResponseMessage("");
    setResponseType("");

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
      
      setOriginalData(dataArticle);
      
      setResponseMessage("Article saved successfully!");
      setResponseType("success");
    } catch (err) {
      console.error("Error saving article:", err);
      setResponseMessage("Failed to save article. Please try again.");
      setResponseType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // useState(() => {
  //   if (responseMessage) {
  //     const timer = setTimeout(() => {
  //       setResponseMessage("");
  //       setResponseType("");
  //     }, 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [responseMessage]);

  return (
    <>
      <div className="flex justify-end items-center gap-4 mb-4">
        {responseMessage && (
          <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
            responseType === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {responseMessage}
          </div>
        )}
        
        {/* <button
          onClick={() => handleSubmit(dataArticle, dataID)}
          disabled={isLoading || !hasUnsavedChanges}
          className={`
            border-2 px-3 py-1.5 rounded-lg text-white transition-all duration-200 flex items-center gap-2
            ${isLoading || !hasUnsavedChanges
              ? 'border-gray-400 bg-gray-400 cursor-not-allowed' 
              : 'border-sky-500 bg-sky-500 hover:bg-sky-600 hover:border-sky-600'
            }
          `}
        >
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          )}
          {isLoading ? 'Saving...' : hasUnsavedChanges ? 'Save Draft' : 'All Changes Saved'}
        </button> */}
      </div>

      <div className="bg-white rounded-lg shadow-lg px-16 py-4 w-full mb-8">
        <Editor 
          data={dataArticle} 
          onChange={(updatedContent) => {
            setData(prev => ({ ...prev, content: updatedContent }))
          }} 
          editorBlock="editorjs-container" 
        />
      </div>
    </>
  );
};

export default WriteArticle;