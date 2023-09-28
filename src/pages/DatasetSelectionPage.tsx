import { Button, Stack } from "@mui/material";
import { parseCSV } from "../utils/parseCSV";
import { Vector3 } from "three";

export interface CSVData {
  timestamp: number;
  objects: ObjectData[];
}

export interface ObjectData {
  id: number;
  position: Vector3;
  velocity: Vector3;
}

interface Prediction {
  timestamp: number;
  position: Vector3;
}

export interface ObjectDataWithPrediction extends ObjectData {
  predictions: Prediction[];
}

export const DatasetSelectionPage = ({
  onSelect,
}: {
  onSelect(fileContent: CSVData[]): void;
}) => {
  async function handleSelect(name: string) {
    onSelect(parseCSV("a,b,c\n1,2,3"));
  }

  return (
    <Stack>
      <Button onClick={() => handleSelect("dataset1.csv")}>Dataset1.csv</Button>
      <Button onClick={() => handleSelect("dataset2.csv")}>Dataset2.csv</Button>
      <Button onClick={() => handleSelect("dataset3.csv")}>Dataset3.csv</Button>
    </Stack>
  );
};
