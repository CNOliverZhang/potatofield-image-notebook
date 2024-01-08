import React from 'react';
import moment from 'moment';
import { createUseStyles } from 'react-jss';
import { Tooltip, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashCan as DeleteIcon,
  faFileEdit as EditIcon,
} from '@fortawesome/free-solid-svg-icons';

import Dialog from '@/imperative-components/dialog';
import Empty from '@/components/empty';
import Storage from '@/store';
import { openWindow } from '@/utils/window';
import styles from './styles';

interface SelectableNoteListProps {
  noteList: Note[];
  onSelect: (article: Note) => void;
  selectedNote: Note | null;
}

const SelectableNoteList: React.FC<SelectableNoteListProps> = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const storage = Storage();
  const { noteList, onSelect, selectedNote } = props;
  const now = new Date();

  const edit = (noteId: string) => {
    openWindow({
      title: '编辑器',
      path: `/editor?id=${noteId}`,
      width: 1200,
      height: 800,
    });
  };

  const remove = (noteId: string) => {
    new Dialog({
      title: '操作确认',
      content: '确定删除文章吗？',
      onConfirm: () => {
        storage.notes.removeNote(noteId);
      },
    });
  };

  return (
    <div className={`${classes.selectableNoteList} ${noteList?.length ? '' : 'empty'}`}>
      {noteList?.length ? (
        noteList
          .sort((a, b) => Number(new Date(b.updateTime)) - Number(new Date(a.updateTime)))
          .map((item) => (
            <div
              key={item.id}
              className={`article ${selectedNote?.id === item.id ? 'selected' : ''}`}
              onClick={() => onSelect(item)}
            >
              <div className="article-title">
                <Typography variant="body1" className="article-title-text">
                  {item.title}
                </Typography>
                <Tooltip title="编辑">
                  <div className="article-title-action">
                    <FontAwesomeIcon
                      icon={EditIcon}
                      size="sm"
                      className="article-title-action-inner"
                      onClick={() => edit(item.id)}
                    />
                  </div>
                </Tooltip>
                <Tooltip title="删除">
                  <div className="article-title-action">
                    <FontAwesomeIcon
                      icon={DeleteIcon}
                      size="sm"
                      className="article-title-action-inner delete"
                      onClick={() => remove(item.id)}
                    />
                  </div>
                </Tooltip>
              </div>
              <Typography variant="caption" color="textSecondary" className="article-update-time">
                {moment(item.updateTime).format(
                  moment(item.updateTime).isSame(now, 'day') ? '今天 HH:mm' : 'YYYY 年 MM 月 DD 日',
                )}
              </Typography>
              <Typography variant="body2" className="article-intro">
                {item.desc}
              </Typography>
            </div>
          ))
      ) : (
        <Empty description="尚无已保存的笔记" />
      )}
    </div>
  );
};

export default SelectableNoteList;
