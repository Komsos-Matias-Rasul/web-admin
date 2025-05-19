"use client"
import { useState } from "react"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal"
import { FiSettings } from "react-icons/fi"

const handleSubmit = async ( titleData, categoryData, writerData, IDData ) => {
  if (!titleData || !categoryData || !writerData) {
    alert("Please fill out the required fields")
    return
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/articles/saveTWC`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({titleData, categoryData, writerData, IDData}),
    })
    if (!res.ok) throw new Error("Failed to save");
    const data = await res.json();
    console.log("Saved successfully:", data);
  } catch (err) {
    console.error("Error saving article:", err);
    return
  }
}

export const SettingsModal = ({ dataID, categories, writers, dataTitle, dataWriter, dataCategory }) => {

  const { onOpen, onOpenChange, isOpen } = useDisclosure()

  const [articleTitle, setTitle] = useState(dataTitle)
  const [selectedWriter, setSelectedWriter] = useState(dataWriter)
  const [selectedCategory, setSelectedCategory] = useState(dataCategory)
  return (
    <>
      <Button onPress={onOpen} startContent={<FiSettings />}>Settings</Button>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Settings</ModalHeader>
              <form>
                <ModalBody>
                  <Input label="Title" value={articleTitle} onChange={(e) => setTitle(e.target.value)} />
                  <div className="mt-4">
                    <label className="block font-medium">Writer</label>
                    <select
                      value={selectedWriter}
                      onChange={(e) => setSelectedWriter(e.target.value)}
                      className="w-full border p-2 rounded-md"
                    >
                      {writers && writers.length > 0 ? (
                        writers.map((writer) => (
                          <option key={writer.id} value={writer.id}>
                            {writer.writer_name}
                          </option>
                        ))
                      ) : (
                        <option value="none">No writers available</option>
                      )}
                    </select>
                  </div>
                  <div className="mt-4">
                    <label className="block font-medium">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full border p-2 rounded-md"
                    >
                      {categories && categories.length > 0 ? (
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.label}
                          </option>
                        ))
                      ) : (
                        <option value="none">No categories available</option>
                      )}
                    </select>
                  </div>

                </ModalBody>
                <ModalFooter>
                  <Button type="reset" color="default" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <button color="primary"
                    onClick={() => {
                      handleSubmit(
                        articleTitle,
                        selectedCategory,
                        selectedWriter,
                        dataID
                      );
                    }}
                    className="border-2 border-sky-500 bg-sky-500 px-3 py-1.5 rounded-lg text-white hover:bg-sky-600 hover:border-sky-600 transition-colors"
                  >
                    Save
                  </button>

                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
