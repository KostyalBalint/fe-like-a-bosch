import { DatasetButton } from './DatasetButton'
import React from 'react'

export function ExistingDataset({ onClick }: { onClick: (name: string) => Promise<void> }) {
    return (
        <div className="flex flex-col gap-4 max-w-md w-full mt-6 animate-up delay-9">
            <span className="uppercase font-bold text-white text-center">Use existing</span>
            <DatasetButton onClick={() => onClick('dataset.csv')}>dataset.csv [CPTA]</DatasetButton>
            <DatasetButton onClick={() => onClick('CPNCO.csv')}>CPNCO demo</DatasetButton>
            <DatasetButton onClick={() => onClick('CPLA.csv')}>CPLA demo</DatasetButton>
        </div>
    )
}
