import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Button, ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material';
import CanvasSelect from 'canvas-select';

import { useThrottle } from '@/utils/tool';
import Storage from '@/store';
import axios from 'axios';
import styles from './styles';

interface NoteEditor {
  canvasSelect: CanvasSelect;
  elementId: string;
  edit?: boolean;
}

const Editor: React.FC<NoteEditor> = (props) => {
  const storage = Storage();
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const [createType, setCreateType] = useState<TagShape>(0);

  const changeMode = (mode: TagShape) => {
    props.canvasSelect.createType = mode;
    props.canvasSelect.update();
  };

  useEffect(() => {
    if (props.canvasSelect) {
      props.canvasSelect.createType = 0;
      props.canvasSelect?.on('updated', () => {
        setCreateType(props.canvasSelect.createType);
      });
    }
  }, [props.canvasSelect]);

  return (
    <div className={classes.container}>
      {props.edit && (
        <div className="toolbar">
          <ToggleButtonGroup
            exclusive
            value={createType}
            onChange={(e, value) => changeMode(value)}
          >
            <ToggleButton size="small" value={0}>
              选择和拖拽
            </ToggleButton>
            <ToggleButton size="small" value={1}>
              添加矩形
            </ToggleButton>
            <ToggleButton size="small" value={2}>
              添加多边形
            </ToggleButton>
            <ToggleButton size="small" value={3}>
              添加点
            </ToggleButton>
            <ToggleButton size="small" value={4}>
              添加折线
            </ToggleButton>
            <ToggleButton size="small" value={5}>
              添加圆形
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      )}
      <canvas id={props.elementId} className="canvas" />
    </div>
  );
};

export default Editor;
