import React, { useCallback, useState } from 'react'
import ReactFlow, { addEdge, Background, Controls, MiniMap, useEdgesState, useNodesState } from 'reactflow'

import { edges as initialEdges, nodes as initialNodes } from './initial-elements'

import 'reactflow/dist/style.css'
import { Dialog, DialogContent } from '@mui/material'
import { Editor } from '@monaco-editor/react'

const minimapStyle = {
    height: 120,
}

export const OverviewFlow = () => {
    const [editorVisible, setEditorVisible] = useState(false)
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [])

    return (
        <>
            <Dialog open={editorVisible} onClose={() => setEditorVisible(false)} maxWidth="md" fullWidth>
                <DialogContent>
                    <h1 className="text-3xl">Edit node content</h1>

                    <Editor
                        height="50vh"
                        defaultLanguage="typescript"
                        defaultValue={`
interface CSVData {}
interface SimulationResult {}

export interface Simulation {
    setDataset(dataset: CSVData[]): void
    runSimulationStep(step: number): SimulationResult
}

export class SimulationEngine {
    constructor(private readonly simulation: Simulation) {}

    run(dataset: CSVData[]): SimulationResult[] {
        this.simulation.setDataset(dataset)
        return dataset.map((data, index) => {
            return this.simulation.runSimulationStep(index)
        })
    }
}
`}
                    />
                </DialogContent>
            </Dialog>
            <ReactFlow
                onNodeClick={() => setEditorVisible(true)}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                attributionPosition="top-right"
            >
                <MiniMap style={minimapStyle} zoomable pannable />
                <Controls />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        </>
    )
}
