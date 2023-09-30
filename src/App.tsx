import React, { useState } from 'react'
import { SimulationPage } from './pages/simulation/SimulationPage'
import { DatasetSelectionPage } from './pages/dataset-selection/DatasetSelectionPage'
import { SimulationResult } from './pages/dataset-selection/types'
import { EditorPage } from './pages/editor/EditorPage'

function App() {
    const [dataset, setDataset] = useState<SimulationResult[]>([])
    const [editorPage, setEditorPage] = useState<boolean>(false)

    // If the editor page is active, show the editor page
    if (editorPage) {
        return <EditorPage onBack={() => setEditorPage(false)} />
    }

    // If the dataset is empty, show the dataset selection page
    if (dataset && dataset.length === 0) {
        return <DatasetSelectionPage onSelect={setDataset} onEdit={() => setEditorPage(true)} />
    }

    // Otherwise, show the simulation page
    return <SimulationPage onBack={() => setDataset([])} values={dataset} />
}

export default App
