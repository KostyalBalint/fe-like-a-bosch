import React, { useState } from "react";
import { SimulationPage } from "./pages/SimulationPage";
import { CSVData, DatasetSelectionPage } from "./pages/DatasetSelectionPage";

function App() {
  const [dataset, setDataset] = useState<CSVData[]>([]);

  if (dataset && dataset.length === 0) {
    return <DatasetSelectionPage onSelect={setDataset} />;
  }

  return <SimulationPage values={[]} />;
}

export default App;
