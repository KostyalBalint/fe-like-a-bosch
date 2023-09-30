import React from 'react'

export function DatasetButton({ children, onClick }: { onClick: () => Promise<void>; children: React.ReactNode }) {
    return (
        <button className="rounded-lg w-full px-24 py-8 text-white relative bg-gradient-to-r from-blue-600 to-pink-500" onClick={onClick}>
            <div className="absolute inset-0.5 bg-black flex items-center justify-center rounded-md hover:bg-transparent transition">{children}</div>
        </button>
    )
}
