import React from 'react'

export const nodes = [
    {
        id: '1',
        type: 'input',
        data: {
            label: 'Simulation Engine',
        },
        position: { x: 250, y: 0 },
    },
    {
        id: '2',
        data: {
            label: 'Object Filter',
        },
        position: { x: 250, y: 100 },
    },
    {
        id: '3',
        data: {
            label: 'Prediction Engine',
        },
        position: { x: 250, y: 200 },
    },
    {
        id: '4',
        position: { x: 250, y: 300 },
        data: {
            label: 'Recognition Engine',
        },
    },
    {
        id: '5',
        data: {
            label: 'Avoidance Calculator',
        },
        position: { x: 250, y: 400 },
    },
    {
        id: '6',
        type: 'output',
        data: {
            label: 'Visualization Engine',
        },
        position: { x: 250, y: 500 },
    },
]

export const edges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    {
        id: 'e3-4',
        source: '3',
        target: '4',
    },
    {
        id: 'e4-5',
        source: '4',
        target: '5',
    },
    {
        id: 'e5-6',
        source: '5',
        target: '6',
    },
]
