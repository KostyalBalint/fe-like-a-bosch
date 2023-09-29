import React, { useState } from 'react'
import { SimulationPage, SimulationResult } from './pages/SimulationPage'
import { CSVData, DatasetSelectionPage } from './pages/DatasetSelectionPage'

function App() {
    const [dataset, setDataset] = useState<SimulationResult[]>([])

    /*if (dataset && dataset.length === 0) {
        return <DatasetSelectionPage onSelect={setDataset} />
    }*/

    return <SimulationPage values={dataset} />
}

export default App
