import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material';
import CanvasSelect from 'canvas-select';

import { TagShape } from '@/types/note';
import styles from './styles';

interface NoteEditor {
  canvasSelect: CanvasSelect;
  elementId: string;
  edit?: boolean;
}

const EditorToolTip = {
  [TagShape.NONE]: '鼠标左键点击标记以选择标记以及编辑标记内容，点击并拖动标记以移动标记',
  [TagShape.RECT]: '鼠标左键点击并拖动以创建矩形，松开完成绘制',
  [TagShape.DOT]: '鼠标左键点击以添加点',
  [TagShape.POLY]: '鼠标左键点击以添加顶点，双击以完成多边形绘制',
  [TagShape.LINE]: '鼠标左键点击以添加顶点，双击以完成折现绘制',
  [TagShape.CIRCLE]: '鼠标左键点击以确定圆心，拖动确定半径，松开鼠标完成圆形绘制',
};

const Editor: React.FC<NoteEditor> = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const [createType, setCreateType] = useState<TagShape>(TagShape.NONE);

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
            size="small"
            className="buttons"
            exclusive
            value={createType}
            onChange={(e, value) => changeMode(value)}
          >
            <ToggleButton size="small" value={TagShape.NONE}>
              选择和拖拽
            </ToggleButton>
            <ToggleButton size="small" value={TagShape.RECT}>
              添加矩形
            </ToggleButton>
            <ToggleButton size="small" value={TagShape.POLY}>
              添加多边形
            </ToggleButton>
            <ToggleButton size="small" value={TagShape.DOT}>
              添加点
            </ToggleButton>
            <ToggleButton size="small" value={TagShape.LINE}>
              添加折线
            </ToggleButton>
            <ToggleButton size="small" value={TagShape.CIRCLE}>
              添加圆形
            </ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="body1">鼠标右键拖动以移动画布，滚轮控制缩放</Typography>
        </div>
      )}
      <canvas id={props.elementId} className="canvas" />
      {props.edit && (
        <div className="toolbar">
          <Typography variant="body1">{EditorToolTip[createType]}</Typography>
        </div>
      )}
    </div>
  );
};

export default Editor;
