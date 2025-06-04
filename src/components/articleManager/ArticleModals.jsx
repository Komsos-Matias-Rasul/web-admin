"use client"
import { useState, useEffect } from "react"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal"
import { FiSettings, FiPlus, FiX } from "react-icons/fi"

const handleSubmit = async ( titleData, categoryData, writerData, IDData ) => {
  if (!titleData || !categoryData || !writerData) {
    alert("Please fill out the required fields")
    return
  }

  try {
    const res = await fetch("/api/articles/saveTWC", {
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

export const SettingsModal = ({ dataID, categories, writers: initialWriters, dataTitle, dataWriter, dataCategory }) => {
  const { onOpen, onOpenChange, isOpen } = useDisclosure()
  const { 
    onOpen: onOpenAddWriter, 
    onOpenChange: onOpenChangeAddWriter, 
    isOpen: isOpenAddWriter 
  } = useDisclosure()

  const [articleTitle, setTitle] = useState(dataTitle)
  const [selectedWriter, setSelectedWriter] = useState(dataWriter)
  const [selectedCategory, setSelectedCategory] = useState(dataCategory)
  
  // State for add writer functionality
  const [writers, setWriters] = useState(initialWriters || [])
  const [newWriterName, setNewWriterName] = useState("")
  const [isAddingWriter, setIsAddingWriter] = useState(false)
  const [addWriterError, setAddWriterError] = useState("")

  // Update writers when initialWriters prop changes
  useEffect(() => {
    if (initialWriters) {
      setWriters(initialWriters)
    }
  }, [initialWriters])

  const handleAddWriter = async () => {
    if (!newWriterName.trim()) {
      setAddWriterError("Please enter a writer name")
      return
    }

    setIsAddingWriter(true)
    setAddWriterError("")

    try {
      const res = await fetch("/api/writers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ writer_name: newWriterName.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to add writer")
      }

      if (data.success) {
        // Add the new writer to the local state
        const newWriter = data.data
        setWriters(prev => [...prev, newWriter])
        
        // Select the newly added writer
        setSelectedWriter(newWriter.id)
        
        // Reset form and close modal
        setNewWriterName("")
        onOpenChangeAddWriter()
        
        // Show success message (optional)
        alert("Writer added successfully!")
      }
    } catch (err) {
      console.error("Error adding writer:", err)
      setAddWriterError(err.message || "Failed to add writer")
    } finally {
      setIsAddingWriter(false)
    }
  }

  const handleCancelAddWriter = () => {
    setNewWriterName("")
    setAddWriterError("")
    onOpenChangeAddWriter()
  }

  return (
    <>
      <Button onPress={onOpen} startContent={<FiSettings />}>Settings</Button>
      
      {/* Main Settings Modal */}
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
                  <Input 
                    label="Title" 
                    value={articleTitle} 
                    onChange={(e) => setTitle(e.target.value)} 
                  />
                  
                  <div className="mt-4">
                    <label className="block font-medium mb-2">Writer</label>
                    <div className="flex gap-2">
                      <select
                        value={selectedWriter}
                        onChange={(e) => setSelectedWriter(e.target.value)}
                        className="flex-1 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select a writer</option>
                        {writers && writers.length > 0 ? (
                          writers.map((writer) => (
                            <option key={writer.id} value={writer.id}>
                              {writer.writer_name}
                            </option>
                          ))
                        ) : (
                          <option value="none" disabled>No writers available</option>
                        )}
                      </select>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={onOpenAddWriter}
                        startContent={<FiPlus size={16} />}
                        className="px-3"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block font-medium mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a category</option>
                      {categories && categories.length > 0 ? (
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.label}
                          </option>
                        ))
                      ) : (
                        <option value="none" disabled>No categories available</option>
                      )}
                    </select>
                  </div>
                </ModalBody>
                
                <ModalFooter>
                  <Button type="reset" color="default" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <button 
                    type="button"
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

      {/* Add Writer Modal */}
      <Modal
        size="sm"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpenAddWriter}
        onOpenChange={onOpenChangeAddWriter}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <FiPlus />
                Add New Writer
              </ModalHeader>
              
              <ModalBody>
                <Input
                  label="Writer Name"
                  placeholder="Enter writer name"
                  value={newWriterName}
                  onChange={(e) => {
                    setNewWriterName(e.target.value)
                    if (addWriterError) setAddWriterError("")
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !isAddingWriter) {
                      e.preventDefault()
                      handleAddWriter()
                    }
                  }}
                  isInvalid={!!addWriterError}
                  errorMessage={addWriterError}
                  autoFocus
                />
              </ModalBody>
              
              <ModalFooter>
                <Button 
                  color="default" 
                  variant="light" 
                  onPress={handleCancelAddWriter}
                  disabled={isAddingWriter}
                >
                  Cancel
                </Button>
                <Button 
                  color="primary"
                  onPress={handleAddWriter}
                  isLoading={isAddingWriter}
                  disabled={!newWriterName.trim() || isAddingWriter}
                >
                  {isAddingWriter ? "Adding..." : "Add Writer"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}