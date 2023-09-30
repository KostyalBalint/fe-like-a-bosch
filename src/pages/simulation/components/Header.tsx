import { AppBar, ButtonBase, Tooltip } from '@mui/material'
import React from 'react'
import { View3DConfig } from '../../../components/3d/View3D'
import TurnSlightRightIcon from '@mui/icons-material/TurnSlightRight'
import StraightenIcon from '@mui/icons-material/Straighten'
import CloseIcon from '@mui/icons-material/Close'
import classnames from 'classnames'

export function Header({ config, onChange, onBack }: { config: View3DConfig; onChange: (config: View3DConfig) => void; onBack: () => void }) {
    function togglePredictions() {
        onChange({
            ...config,
            showPredictions: !config.showPredictions,
        })
    }

    function toggleBrakeDistance() {
        onChange({
            ...config,
            showBrakeDistance: !config.showBrakeDistance,
        })
    }

    function toggleIntersection() {
        onChange({
            ...config,
            showIntersections: !config.showIntersections,
        })
    }

    return (
        <AppBar position="static" elevation={0}>
            <div className="flex items-center justify-between h-16 px-4 bg-gray-900 border-gray-800 border-b">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="logo" className="h-8" />
                    <h1 className="text-white font-bold text-[24px] uppercase">CrashCraft</h1>
                </div>

                <div className="flex items-center gap-2">
                    <Tooltip title="Toggle intersection visibility">
                        <IconButton onClick={toggleIntersection} active={config.showIntersections}>
                            <CloseIcon id="toggle-intersection" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Toggle prediction visibility">
                        <IconButton onClick={togglePredictions} active={config.showPredictions}>
                            <TurnSlightRightIcon id="toggle-prediction" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Toggle brake distance visibility">
                        <IconButton onClick={toggleBrakeDistance} active={config.showBrakeDistance}>
                            <StraightenIcon id="toggle-brake" />
                        </IconButton>
                    </Tooltip>

                    <ButtonBase onClick={onBack}>
                        <span id="change-dataset" className="text-white rounded p-2 bg-gray-800">
                            Change dataset
                        </span>
                    </ButtonBase>
                </div>
            </div>
        </AppBar>
    )
}

function IconButton({ children, onClick, active }: { children: React.ReactNode; onClick: () => void; active: boolean }) {
    return (
        <button onClick={onClick} className={classnames('rounded p-2', active ? 'bg-gray-800' : 'bg-gray-700')}>
            {children}
        </button>
    )
}
