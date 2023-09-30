import React from 'react'
import { OverviewFlow } from './OverviewFlow'
import { ButtonBase } from '@mui/material'

export function EditorPage({ onBack }: { onBack: () => void }) {
    return (
        <div className="w-screen h-screen overflow-hidden bg-black">
            <div className="p-4 fixed z-50">
                <ButtonBase onClick={onBack}>
                    <span className="text-white rounded p-2 bg-gray-800">Back</span>
                </ButtonBase>
            </div>
            <OverviewFlow />
        </div>
    )
}
