import React from 'react'

export function Title() {
    return (
        <div className="flex flex-col gap-3">
            <img className="h-10 object-contain animate-up" src="/logo.png" />
            <div className="text-center animate-up delay-3">
                <h1 className="text-7xl font-bold text-white inline text-center">
                    Welcome to{' '}
                    <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500 inline">
                        CrashCraft!
                    </span>
                </h1>
            </div>
            <p className="text-white text-lg text-center animate-up delay-6">Start by selecting a dataset for the simulation.</p>
        </div>
    )
}
