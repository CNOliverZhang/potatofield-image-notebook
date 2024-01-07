import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useTheme } from '@mui/material';
import CanvasSelect from 'canvas-select';

import { useThrottle } from '@/utils/tool';
import Storage from '@/store';
import axios from 'axios';
import styles from './styles';

interface NoteEditor {
  data: Tag[];
  img: string;
}

const Editor: React.FC<NoteEditor> = (props) => {
  const storage = Storage();
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });

  const [styleSheet, setStyleSheet] = useState('');
  const canvasSelect = useRef<CanvasSelect>();

  useEffect(() => {
    canvasSelect.current = new CanvasSelect('#canvas');
    canvasSelect.current!.createType = 1;
    canvasSelect.current?.setData(props.data);
  }, []);

  useEffect(() => {
    canvasSelect.current?.setImage(props.img);
  }, [props.img]);

  return <canvas id="canvas" className={classes.container} />;
};

export default Editor;
