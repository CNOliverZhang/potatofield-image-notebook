import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Button, useTheme } from '@mui/material';
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

  const [styleSheet, setStyleSheet] = useState('');
  const canvasSelect = useRef<CanvasSelect>();

  const changeMode = (mode: TagShape) => {
    props.canvasSelect.createType = mode;
    props.canvasSelect.update();
  };

  useEffect(() => {
    if (props.canvasSelect) {
      props.canvasSelect.createType = 1;
    }
  }, [props.canvasSelect]);

  return (
    <div className={classes.container}>
      {props.edit && (
        <div className="toolbar">
          <Button onClick={() => changeMode(0)}>选择和拖拽</Button>
          <Button onClick={() => changeMode(1)}>添加矩形</Button>
          <Button onClick={() => changeMode(2)}>添加多边形</Button>
          <Button onClick={() => changeMode(3)}>添加点</Button>
          <Button onClick={() => changeMode(4)}>添加折线</Button>
          <Button onClick={() => changeMode(5)}>添加圆形</Button>
        </div>
      )}
      <canvas id={props.elementId} className="canvas" />
    </div>
  );
};

export default Editor;
