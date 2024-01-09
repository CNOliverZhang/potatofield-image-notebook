import Store from 'electron-store';
import { Note } from '@/types/note';

const notes = (store: Store) => {
  const setNoteList = (noteList: Note[]) => {
    store.set('noteList', noteList);
  };

  const getNoteList = () => {
    return (store.get('noteList') as Note[]) || [];
  };

  const addNote = (note: Note) => {
    store.set('noteList', [...((store.get('noteList') as Note[]) || []), note]);
  };

  const removeNote = (articleId: string) => {
    const noteList = (store.get('noteList') as Note[]) || [];
    const index = noteList.findIndex((note) => note.id === articleId);
    if (index >= 0) {
      noteList.splice(index, 1);
      store.set('noteList', noteList);
    }
  };

  const updateNote = (articleId: string, updatedArticle: Note) => {
    const noteList = (store.get('noteList') as Note[]) || [];
    const index = noteList.findIndex((note) => note.id === articleId);
    if (index >= 0) {
      noteList.splice(index, 1, updatedArticle);
      store.set('noteList', noteList);
    }
  };

  const watchNoteList = (callback: (noteList: Note[], oldNoteList: Note[]) => void) => {
    store.onDidChange('noteList', (newValue, oldValue) => {
      callback(newValue as Note[], oldValue as Note[]);
    });
  };

  return {
    setNoteList,
    getNoteList,
    addNote,
    removeNote,
    updateNote,
    watchNoteList,
  };
};

export default notes;
