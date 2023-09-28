import {
  bindMenu,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import {
  Button,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import React from "react";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";

interface PlaybackControlProps {
  onTogglePlayback: () => void;
  onSpeedChange: (speed: number) => void;
  value: number;
  isPlaying: boolean;
  speed: number;
  total: number;
}

export function PlaybackControl({
  onTogglePlayback,
  onSpeedChange,
  value,
  isPlaying,
  speed,
  total,
}: PlaybackControlProps) {
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });
  return (
    <Stack
      id="playback-control"
      direction="row"
      p={1}
      sx={{
        alignItems: "center",
        backgroundColor: "grey.200",
        borderTop: "1px solid",
        borderColor: "grey.500",
      }}
    >
      <Button
        startIcon={<SlowMotionVideoIcon />}
        id="speed-selector"
        size="small"
        variant="text"
        color="primary"
        {...bindTrigger(popupState)}
      >
        {speed}x
      </Button>
      <Menu {...bindMenu(popupState)}>
        <MenuItem
          onClick={() => {
            popupState.close();
            onSpeedChange(0.1);
          }}
        >
          0.1x
        </MenuItem>
        <MenuItem
          onClick={() => {
            popupState.close();
            onSpeedChange(0.5);
          }}
        >
          0.5x
        </MenuItem>
        <MenuItem
          onClick={() => {
            popupState.close();
            onSpeedChange(1);
          }}
        >
          1x
        </MenuItem>
        <MenuItem
          onClick={() => {
            popupState.close();
            onSpeedChange(1.5);
          }}
        >
          1.5x
        </MenuItem>
      </Menu>
      <IconButton
        id="play-button"
        sx={{ mr: 2 }}
        color="primary"
        onClick={onTogglePlayback}
      >
        {!isPlaying ? <PlayArrowIcon /> : <PauseIcon />}
      </IconButton>
      <Typography mr={2} color="primary">
        {(value / 100).toFixed(2)}s
      </Typography>
      <LinearProgress
        sx={{ width: "100%" }}
        value={(value / total) * 100}
        variant="buffer"
      />
    </Stack>
  );
}
