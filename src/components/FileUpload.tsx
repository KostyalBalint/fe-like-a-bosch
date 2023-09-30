import { useDropzone } from 'react-dropzone'
import React, { useEffect } from 'react'
import { PiUploadSimpleBold } from 'react-icons/pi'

interface FileUploadProps {
    onFileUpload: (file: File) => void
}

export const FileUpload = (props: FileUploadProps) => {
    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        maxFiles: 1,
        accept: {
            csv: ['text/csv'],
        },
    })

    useEffect(() => {
        if (acceptedFiles.length > 0) {
            props.onFileUpload(acceptedFiles[0])
        }
    }, [acceptedFiles])

    return (
        <div {...getRootProps()} className="text-white">
            <input {...getInputProps()} />
            <div className="flex items-center">
                <PiUploadSimpleBold className="w-8 h-8 mr-4 flex-shrink-0" />

                <p>Drop your CSV here or click on the box to select a file</p>
            </div>
        </div>
    )
}
