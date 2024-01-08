import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',

    '& .toolbat': {
      display: 'flex',
    },

    '& .canvas': {
      width: '100%',
      flexGrow: 1,
    },
  },
});
