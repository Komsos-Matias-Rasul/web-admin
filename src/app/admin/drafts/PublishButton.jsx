"use client"

import { publishArticle } from "@/actions/articles";
import { Button } from "@heroui/button";
import { FaCheck } from "react-icons/fa";

const handlePublish = async (articleId) => {
  try {
    await publishArticle(articleId)
  } catch (err) {
    console.error(err)
  }
}
export const PublishButton = ({rowId}) => <Button onPress={()=>handlePublish(rowId)} title="Publish" isIconOnly size="sm" className="bg-emerald-500 text-white" startContent={<FaCheck size={15} />} />