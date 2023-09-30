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
            <div className="flex">
                <PiUploadSimpleBold className="w-12 h-12 mr-4" />

                <p>Drag 'n' drop some files here, or click to select</p>
            </div>
        </div>
    )
}
