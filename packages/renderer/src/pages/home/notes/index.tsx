import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { ipcRenderer } from 'electron';
import { IconButton, TextField, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus as AddIcon } from '@fortawesome/free-solid-svg-icons';

import Storage from '@/store';
import Empty from '@/components/empty';
import NoteEditor from '@/components/note-editor';
import { useDebounce } from '@/utils/tool';
import { openWindow } from '@/utils/window';
import { isWindows as getIsWindows } from '@/utils/platform';
import SelectableList from './selectable-note-list';
import styles from './styles';

const Notes: React.FC = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const storage = Storage();
  const [isWindows] = useState(getIsWindows());
  const [noteList, setNoteList] = useState(storage.notes.getNoteList());
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const selectedNoteRef = useRef<Note | null>();

  storage.notes.watchNoteList((notes) => setNoteList(notes));

  storage.notes.watchNoteList((storageNoteList) => {
    if (!storageNoteList.find((note) => note.id === selectedNoteRef.current?.id)) {
      setSelectedNote(null);
    }
  });

  const debouncedSearch = useRef(
    useDebounce((value) => setSearchKeyword(value), 500, { leading: false }),
  );

  const onListSelect = (note: Note) => {
    setSelectedNote(note);
  };

  const addArticle = () => {
    openWindow({ title: '编辑器', path: '/editor', width: 1200, height: 800 });
  };

  useEffect(() => {
    selectedNoteRef.current = selectedNote;
  }, [selectedNote]);

  useEffect(() => {
    debouncedSearch.current?.(keyword);
  }, [keyword]);

  return (
    <div className={classes.notes}>
      <div className="note-list">
        <div className="note-list-header">
          <TextField
            size="small"
            className="search"
            label="搜索标题"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <IconButton onClick={addArticle} className="add-button">
            <FontAwesomeIcon icon={AddIcon} />
          </IconButton>
        </div>
        <SelectableList
          noteList={noteList.filter((item) => item.title.includes(searchKeyword))}
          onSelect={onListSelect}
          selectedNote={selectedNote}
        />
      </div>
      {selectedNote ? (
        <div className="note-preview">
          <div className={`note-preview-title ${isWindows ? 'app-wrapper-padding' : ''}`}>
            <Typography variant="h4" className="note-preview-title-text">
              {selectedNote?.title}
            </Typography>
          </div>
          <div className="note-preview-content">
            <NoteEditor
              data={[]}
              img="https://files.potatofield.cn/MediaCenter/Images/1de0a1f20bfd7577772e184fc07b91f9.webp"
            />
          </div>
        </div>
      ) : (
        <div className="note-preview empty">
          <Empty description="尚未选择" />
        </div>
      )}
    </div>
  );
};

export default Notes;
