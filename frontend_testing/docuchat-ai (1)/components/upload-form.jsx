"use client"

import { useState, useRef } from "react"
import { FileIcon, UploadIcon, CheckCircleIcon } from "lucide-react"

export default function UploadForm({ onUpload, uploadedFile, isLoading }) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf") {
        onUpload(file)
      }
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload a Document</h2>

      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[250px] transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleChange} className="hidden" />

        {uploadedFile ? (
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="mb-2 font-medium text-gray-900">File Uploaded</h3>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <FileIcon className="w-4 h-4" />
              <span className="truncate max-w-[200px]">{uploadedFile.name}</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
              <UploadIcon className="w-8 h-8 text-blue-600" />
            </div>
            <p className="mb-2 text-sm text-gray-600 text-center">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 text-center">PDF files only</p>
          </>
        )}
      </div>

      <button
        onClick={handleButtonClick}
        disabled={isLoading || !!uploadedFile}
        className={`mt-4 w-full py-2.5 px-4 rounded-md font-medium transition-colors ${
          isLoading || uploadedFile
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </div>
        ) : uploadedFile ? (
          "File Uploaded"
        ) : (
          "Upload"
        )}
      </button>
    </div>
  )
}
