import React, { useState } from 'react'
import { SimulationPage } from './pages/simulation/SimulationPage'
import { DatasetSelectionPage } from './pages/dataset-selection/DatasetSelectionPage'
import { SimulationResult } from './pages/dataset-selection/types'

function App() {
    const [dataset, setDataset] = useState<SimulationResult[]>([])

    // If the dataset is empty, show the dataset selection page
    if (dataset && dataset.length === 0) {
        return <DatasetSelectionPage onSelect={setDataset} />
    }

    // Otherwise, show the simulation page
    return <SimulationPage values={dataset} />
}

export default App
