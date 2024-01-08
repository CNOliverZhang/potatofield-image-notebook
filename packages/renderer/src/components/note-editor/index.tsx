import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useTheme } from '@mui/material';
import CanvasSelect from 'canvas-select';

import { useThrottle } from '@/utils/tool';
import Storage from '@/store';
import axios from 'axios';
import styles from './styles';

interface NoteEditor {
  canvasSelect: CanvasSelect;
  elementId: string;
}

const Editor: React.FC<NoteEditor> = (props) => {
  const storage = Storage();
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });

  const [styleSheet, setStyleSheet] = useState('');
  const canvasSelect = useRef<CanvasSelect>();

  useEffect(() => {
    if (props.canvasSelect) {
      props.canvasSelect.createType = 1;
    }
  }, [props.canvasSelect]);

  return <canvas id={props.elementId} className={classes.container} />;
};

export default Editor;
