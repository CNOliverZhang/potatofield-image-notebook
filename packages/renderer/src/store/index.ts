import Store from 'electron-store';

import getSettings from './settings';
import getNotes from './notes';
import getUserInfo from './user-info';

const store = new Store({ watch: true });

const storage = () => {
  const settings = getSettings(store);
  const notes = getNotes(store);
  const userInfo = getUserInfo(store);

  return {
    settings,
    notes,
    userInfo,
  };
};

export default storage;
