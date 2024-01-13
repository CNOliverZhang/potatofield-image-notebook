import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import fs from 'fs';
import { createUseStyles } from 'react-jss';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import CanvasSelect from 'canvas-select';
import { Button, TextField, Typography, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan as DeleteIcon } from '@fortawesome/free-solid-svg-icons';
import { PhotoProvider, PhotoView } from 'react-photo-view';

import AppWrappper from '@/components/app-wrappper';
import NoteEditor from '@/components/note-editor';
import Empty from '@/components/empty';
import Message from '@/imperative-components/message';
import Dialog from '@/imperative-components/dialog';
import Upload from '@/utils/upload';
import { closeWindow, openWindow } from '@/utils/window';
import { changeUrlParams } from '@/utils/url';
import { isWindows as getIsWindows } from '@/utils/platform';
import Storage from '@/store';
import { Note, Tag } from '@/types/note';
import { compressImage } from '@/utils/compress';
import { CanvasExtend } from '@/types/canvas';
import styles from './styles';

const Editor: React.FC = (props) => {
  const storage = Storage();
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });

  const [isWindows] = useState(getIsWindows());
  const [id, setId] = useState(
    new URLSearchParams(window.location.hash.split('?').pop()).get('id'),
  );
  const [noteImageLoading, setNoteImageLoading] = useState(false);
  const [galleryImageLoading, setGalleryImageLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState<Tag>();
  const canvasSelectRef = useRef<CanvasExtend>();
  const idRef = useRef(id);

  const noteForm = useForm<Note>();
  const tagContentForm = useForm<Tag>();

  const resizeCanvas = () => {
    canvasSelectRef.current?.resize?.();
    canvasSelectRef.current?.fitZoom();
  };

  const uploadImage = async (files: FileList) => {
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
    const uploadFunction = Upload[storage.settings.getUploadTarget()].upload;
    try {
      const url = await uploadFunction(filepath);
      return Promise.resolve(url);
    } catch (err) {
      new Dialog({
        title: '上传失败',
        content: (err as Error).message,
        showCancel: false,
      });
      return Promise.reject();
    } finally {
      if (filepath !== files[0].path) {
        fs.rmSync(filepath);
      }
    }
  };

  const setNoteImgae = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      setNoteImageLoading(true);
      try {
        const url = await uploadImage(files);
        noteForm.setValue('image', url, { shouldDirty: true });
      } catch {
      } finally {
        setNoteImageLoading(false);
      }
    }
  };

  const addImageToTag = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      setGalleryImageLoading(true);
      try {
        const url = await uploadImage(files);
        tagContentForm.setValue('images', [...(tagContentForm.getValues('images') || []), url], {
          shouldDirty: true,
        });
      } catch {
      } finally {
        setGalleryImageLoading(false);
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
    canvasSelectRef.current?.setImage(noteForm.getValues().image);
  }, [noteForm.watch('image')]);

  useEffect(() => {
    const canvas = new CanvasSelect('canvas');
    canvasSelectRef.current = canvas;
    if (idRef.current) {
      const note = storage.notes.getNoteList().find((item) => item.id === idRef.current);
      if (note) {
        noteForm.reset(note);
        canvas.setData(note.tags);
      }
    }
    canvas.on('select', (tag: Tag) => setCurrentTag(tag));
    canvas.on('updated', (data: Tag[]) => noteForm.setValue('tags', data, { shouldDirty: true }));
    window.addEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    tagContentForm.reset(currentTag);
  }, [currentTag]);

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
              canvasSelect={canvasSelectRef.current as CanvasSelect}
              elementId="canvas"
            />
          </div>
        </div>
        <div className="info">
          <div className={`info-controller ${isWindows ? 'app-wrapper-padding' : ''}`}>
            <Typography variant="h4" className="info-title" gutterBottom>
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
              fullWidth
              component="label"
              color="primary"
              variant="contained"
              loading={noteImageLoading}
              className="upload-button"
            >
              <input
                name="file"
                type="file"
                accept="image/*"
                multiple={false}
                className="input"
                onChange={setNoteImgae}
              />
              {noteForm.watch('image') ? '更改图片' : '上传图片'}
            </LoadingButton>
            <Controller
              name="desc"
              defaultValue=""
              control={noteForm.control}
              render={({ field }) => (
                <TextField
                  label="笔记简介"
                  multiline
                  rows={3}
                  className="info-desc"
                  placeholder="笔记简介"
                  size="small"
                  {...field}
                />
              )}
            />
          </div>
          <div className="info-tag">
            {currentTag ? (
              <>
                <Typography variant="h6" gutterBottom>
                  正在编辑的标记
                </Typography>
                <Controller
                  name="label"
                  defaultValue=""
                  control={tagContentForm.control}
                  render={({ field }) => (
                    <TextField
                      label="标记主题"
                      fullWidth
                      placeholder="标记主题"
                      size="small"
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="data"
                  defaultValue=""
                  control={tagContentForm.control}
                  render={({ field }) => (
                    <textarea className="info-tag-textarea" {...field} placeholder="标记内容" />
                  )}
                />
                <Typography variant="h6" gutterBottom>
                  标记包含的图片
                </Typography>
                <div className="info-tag-gallery">
                  <div className="info-tag-gallery-inner">
                    <LoadingButton
                      component="label"
                      color="primary"
                      variant="contained"
                      className="info-tag-gallery-button"
                      loading={galleryImageLoading}
                    >
                      <input
                        name="file"
                        type="file"
                        accept="image/*"
                        multiple={false}
                        className="input"
                        onChange={addImageToTag}
                      />
                      上传图片
                    </LoadingButton>
                    <PhotoProvider>
                      {(tagContentForm.watch('images') || []).map((url, index) => (
                        // <div
                        //   className="info-tag-gallery-item"
                        //   style={{ backgroundImage: `url(${url})` }}
                        // />
                        <PhotoView key={url} src={url}>
                          <img src={url} className="info-tag-gallery-item" alt="" />
                        </PhotoView>
                      ))}
                    </PhotoProvider>
                  </div>
                </div>
              </>
            ) : (
              <Empty description="暂未选中标记" />
            )}
          </div>
          <div className="info-button-group">
            <Button
              color="primary"
              variant="contained"
              className="action-button"
              onClick={save}
              disabled={
                !noteForm.formState.isDirty || !noteForm.watch('title') || !noteForm.watch('image')
              }
            >
              保存
            </Button>
            <Button
              color="primary"
              variant="contained"
              className="action-button"
              onClick={saveAsNew}
              disabled={!id || !noteForm.watch('title') || !noteForm.watch('image')}
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
      </div>
    </AppWrappper>
  );
};

export default Editor;
