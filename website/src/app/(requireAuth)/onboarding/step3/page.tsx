'use client'

import toast from 'react-hot-toast'

import { FileUploadButton } from '@/components/FileUploadButton'
import { callApi } from '@/lib/callApi'

export default function Step1Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-3xl">Finally it is time to upload your data! 🚀</h1>
      <h2 className="mt-4 text-2xl">
        Choose either the sample data or your Linkedin data if it is ready
      </h2>

      <FileUploadButton
        onUpload={async (formData: FormData) => {
          try {
            const data = await callApi('/api/upload', {
              method: 'POST',
              body: formData,
            })
            toast.success('File uploaded successfully!')

            window.location.href = '/dashboard'
          } catch (e) {
            console.error('Error uploading file:', e)
            toast.error('Failed to upload file')
          }
        }}
        className="mt-4"
      >
        Upload Linkedin Contacts
      </FileUploadButton>

      <span className="text-md mt-4 text-gray-500">
        (Psst... if Linkedin is taking too long, you can also modify the sample
        data to include your connections 😊)
      </span>
    </div>
  )
}
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
