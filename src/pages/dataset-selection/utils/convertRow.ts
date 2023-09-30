import { Vector2 } from 'three'

import { RawDataRow } from '../types'

export function convertRow(row: RawDataRow) {
    return {
        vehicleSpeed: Number(row.VehicleSpeed) / 256,
        yawRate: Number(row.YawRate),
        objects: [
            {
                id: 0,
                position: new Vector2(Number(row.FirstObjectDistance_X) / 128, Number(row.FirstObjectDistance_Y) / 128),
                velocity: new Vector2(Number(row.FirstObjectSpeed_X) / 256, Number(row.FirstObjectSpeed_Y) / 256),
            },
            {
                id: 1,
                position: new Vector2(Number(row.SecondObjectDistance_X) / 128, Number(row.SecondObjectDistance_Y) / 128),
                velocity: new Vector2(Number(row.SecondObjectSpeed_X) / 256, Number(row.SecondObjectSpeed_Y) / 256),
            },
            {
                id: 2,
                position: new Vector2(Number(row.ThirdObjectDistance_X) / 128, Number(row.ThirdObjectDistance_Y) / 128),
                velocity: new Vector2(Number(row.ThirdObjectSpeed_X) / 256, Number(row.ThirdObjectSpeed_Y) / 256),
            },
            {
                id: 3,
                position: new Vector2(Number(row.FourthObjectDistance_X) / 128, Number(row.FourthObjectDistance_Y) / 128),
                velocity: new Vector2(Number(row.FourthObjectSpeed_X) / 256, Number(row.FourthObjectSpeed_Y) / 256),
            },
        ],
        timestamp: Number(row.Timestamp),
    }
}
