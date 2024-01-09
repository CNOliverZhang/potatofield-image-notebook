import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',

    '& .toolbar': {
      display: 'flex',
      height: 60,
      backgroundColor: theme.palette.background.paper,
    },

    '& .canvas': {
      width: '100%',
      flexGrow: 1,
    },
  },
});
