import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import fs from 'fs';
import { clipboard, ipcRenderer } from 'electron';
import { createUseStyles } from 'react-jss';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import CanvasSelect from 'canvas-select';
import {
  Button,
  ListItemIcon,
  MenuItem,
  MenuList,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashCan as DeleteIcon,
  faCopy as CopyIcon,
  faFilePdf as PdfIcon,
  faImage as ImageIcon,
} from '@fortawesome/free-solid-svg-icons';

import useThemeContext from '@/contexts/theme';
import AppWrappper from '@/components/app-wrappper';
import NoteEditor from '@/components/note-editor';
import Message from '@/imperative-components/message';
import Dialog from '@/imperative-components/dialog';
import Loading from '@/imperative-components/loading';
import Upload from '@/utils/upload';
import { closeWindow, openWindow } from '@/utils/window';
import { changeUrlParams } from '@/utils/url';
import { isWindows as getIsWindows } from '@/utils/platform';
import Storage from '@/store';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { compressImage } from '@/utils/compress';
import styles from './styles';

const Editor: React.FC = (props) => {
  const storage = Storage();
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const { darkMode } = useThemeContext();

  const [isWindows] = useState(getIsWindows());
  const [id, setId] = useState(
    new URLSearchParams(window.location.hash.split('?').pop()).get('id'),
  );
  const [imageLoading, setImageLoading] = useState(false);
  const canvasSelect = useRef<CanvasSelect>();
  const idRef = useRef(id);

  const noteForm = useForm<Note>();

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      let filepath = files[0].path;
      if (storage.settings.getUploadCompress()) {
        filepath = await compressImage(filepath, storage.settings.getUploadCompressQuality());
      }
      const uploadConfig = storage.settings.getUploadTarget();
      if (!uploadConfig) {
        new Dialog({
          title: '上传失败',
          content: '未填写图片上传配置，请前往设置页面填写。',
          showCancel: false,
          onConfirm: () => {
            openWindow({
              title: '设置',
              path: '/settings',
              width: 600,
              height: 400,
              resizable: false,
            });
          },
        });
      }
      setImageLoading(true);
      const uploadFunction = Upload[storage.settings.getUploadTarget()].upload;
      try {
        const url = await uploadFunction(filepath);
        noteForm.setValue('image', url, { shouldDirty: true });
      } catch (err) {
        new Dialog({
          title: '上传失败',
          content: (err as Error).message,
          showCancel: false,
        });
      } finally {
        if (filepath !== files[0].path) {
          fs.rmSync(filepath);
        }
        setImageLoading(false);
      }
    }
  };

  const saveAsNew = () => {
    const newId = uuid();
    const note: Note = {
      ...noteForm.getValues(),
      id: newId,
      createTime: new Date(),
      updateTime: new Date(),
    };
    storage.notes.addNote(note);
    changeUrlParams({ id: newId });
    setId(newId);
    noteForm.reset(note);
  };

  const save = () => {
    if (idRef.current) {
      const note: Note = {
        ...noteForm.getValues(),
        updateTime: new Date(),
      };
      storage.notes.updateNote(idRef.current, note);
      noteForm.reset(note);
    } else {
      saveAsNew();
    }
  };

  const remove = () => {
    new Dialog({
      title: '操作确认',
      content: '确定删除笔记吗？',
      onConfirm: () => {
        storage.notes.removeNote(id as string);
        closeWindow();
      },
    });
  };

  storage.notes.watchNoteList((noteList) => {
    if (idRef.current && !noteList.find((note) => note.id === idRef.current)) {
      new Message({
        content: '正在编辑的笔记已被删除，请重新保存',
        type: 'warning',
      });
      noteForm.setValue('id', '', { shouldDirty: true });
      changeUrlParams({});
      setId('');
    }
  });

  useEffect(() => {
    canvasSelect.current?.setImage(noteForm.getValues().image);
  }, [noteForm.watch('image')]);

  useEffect(() => {
    const canvas = new CanvasSelect('canvas');
    canvasSelect.current = canvas;
    if (idRef.current) {
      const note = storage.notes.getNoteList().find((item) => item.id === idRef.current);
      if (note) {
        noteForm.reset(note);
        canvas.setData(note.tags);
      }
    }
    canvas.on('updated', (data) => noteForm.setValue('tags', data, { shouldDirty: true }));
  }, []);

  useEffect(() => {
    idRef.current = id;
  }, [id]);

  return (
    <AppWrappper noHeight>
      <div className={classes.container}>
        <div className={`editor ${isWindows ? '' : 'app-wrapper-padding'}`}>
          <Controller
            name="title"
            defaultValue=""
            control={noteForm.control}
            render={({ field }) => (
              <TextField label="文章标题" placeholder="无标题" size="small" {...field} />
            )}
          />
          <div className="canvas-container">
            <NoteEditor
              edit
              canvasSelect={canvasSelect.current as CanvasSelect}
              elementId="canvas"
            />
          </div>
        </div>
        <div className="preview">
          <div className={`preview-controller ${isWindows ? 'app-wrapper-padding' : ''}`}>
            <Typography variant="h4" className="preview-title" gutterBottom>
              {noteForm.watch('title') || '未命名'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {noteForm.watch('updateTime')
                ? `保存于 ${moment(noteForm.watch('updateTime') || new Date()).format(
                    'YYYY 年 MM 月 DD 日 HH:mm:SS',
                  )}`
                : '尚未保存'}
            </Typography>
            <LoadingButton
              component="label"
              color="primary"
              variant="contained"
              loading={imageLoading}
            >
              <input
                name="file"
                type="file"
                accept="image/*"
                multiple={false}
                className="input"
                onChange={uploadImage}
              />
              {noteForm.watch('image') ? '更改图片' : '上传图片'}
            </LoadingButton>
            <Controller
              name="desc"
              defaultValue=""
              control={noteForm.control}
              render={({ field }) => (
                <TextField label="标记内容" placeholder="标记内容" size="small" {...field} />
              )}
            />
            <div className="button-group">
              <Button
                color="primary"
                variant="contained"
                className="action-button"
                onClick={save}
                disabled={
                  !noteForm.formState.isDirty ||
                  !noteForm.watch('desc') ||
                  !noteForm.watch('title') ||
                  !noteForm.watch('image')
                }
              >
                保存
              </Button>
              <Button
                color="primary"
                variant="contained"
                className="action-button"
                onClick={saveAsNew}
                disabled={
                  !id ||
                  !noteForm.watch('desc') ||
                  !noteForm.watch('title') ||
                  !noteForm.watch('image')
                }
              >
                保存副本
              </Button>
              <Button
                color="error"
                variant="contained"
                className="action-button"
                onClick={remove}
                startIcon={<FontAwesomeIcon icon={DeleteIcon} />}
                disabled={!id}
              >
                删除
              </Button>
            </div>
          </div>
          <div className="preview-wrapper" />
        </div>
      </div>
    </AppWrappper>
  );
};

export default Editor;
