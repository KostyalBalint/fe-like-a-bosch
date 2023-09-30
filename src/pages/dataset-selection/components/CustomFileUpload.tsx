import { FileUpload } from '../../../components/FileUpload'
import React from 'react'

export function CustomFileUpload({ onFileUpload }: { onFileUpload: (file: File) => Promise<void> }) {
    return (
        <div className="flex flex-col max-w-md w-full gap-8 mt-6 animate-up delay-10">
            <span className="uppercase font-bold text-white text-center">Upload your own</span>
            <button className="rounded-lg w-fulltext-white relative z-10 flex group">
                <div className="absolute inset-2 group-hover:inset-1 bg-gradient-to-r from-blue-600 to-pink-500 blur-xl -z-10" />
                <div className="bg-black px-24 py-8 w-full h-full rounded-2xl">
                    <FileUpload onFileUpload={onFileUpload} />
                </div>
            </button>
        </div>
    )
}
