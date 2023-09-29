import { bindMenu, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks'
import { Button, IconButton, LinearProgress, Menu, MenuItem, Slider, Stack, Typography } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import React, { useEffect } from 'react'
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo'

interface PlaybackControlProps {
    onTogglePlayback: () => void
    onSpeedChange: (speed: number) => void
    onChange: (value: number) => void
    value: number
    isPlaying: boolean
    speed: number
    total: number
    timestamp: number
}

export function PlaybackControl({ onTogglePlayback, onSpeedChange, value, isPlaying, speed, total, timestamp, onChange }: PlaybackControlProps) {
    const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.key === ' ') {
                onTogglePlayback()
            }
        }
        window.addEventListener('keydown', listener)
        return () => {
            window.removeEventListener('keydown', listener)
        }
    }, [onTogglePlayback])

    return (
        <Stack id="playback-control" direction="row" p={1} className="border-t border-gray-800 items-center bg-gray-900 pr-6">
            <Button startIcon={<SlowMotionVideoIcon />} id="speed-selector" size="small" variant="text" color="primary" {...bindTrigger(popupState)}>
                {speed}x
            </Button>
            <Menu {...bindMenu(popupState)}>
                <MenuItem
                    onClick={() => {
                        popupState.close()
                        onSpeedChange(0.1)
                    }}
                >
                    0.1x
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        popupState.close()
                        onSpeedChange(0.5)
                    }}
                >
                    0.5x
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        popupState.close()
                        onSpeedChange(1)
                    }}
                >
                    1x
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        popupState.close()
                        onSpeedChange(1.5)
                    }}
                >
                    1.5x
                </MenuItem>
            </Menu>
            <IconButton id="play-button" sx={{ mr: 2 }} color="primary" onClick={onTogglePlayback}>
                {!isPlaying ? <PlayArrowIcon /> : <PauseIcon />}
            </IconButton>
            <Typography mr={2} color="primary">
                {timestamp.toFixed(2)}s
            </Typography>
            <Slider
                aria-label="time-indicator"
                size="small"
                value={value}
                min={0}
                step={1}
                max={total - 1}
                onChange={(_, value) => onChange(value as number)}
                sx={{
                    color: 'primary.main',
                    height: 4,
                    '& .MuiSlider-thumb': {
                        width: 8,
                        height: 8,
                        transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                        '&:before': {
                            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                        },
                        '&:hover, &.Mui-focusVisible': {
                            boxShadow: `0px 0px 0px 8px rgb(255 255 255 / 16%)`,
                        },
                        '&.Mui-active': {
                            width: 20,
                            height: 20,
                        },
                    },
                    '& .MuiSlider-rail': {
                        opacity: 0.28,
                    },
                }}
            />
        </Stack>
    )
}
