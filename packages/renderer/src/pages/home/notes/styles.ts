import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  notes: {
    display: 'flex',
    width: '100%',
    height: '100%',

    '& .note-list': {
      width: 300,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',

      '&-header': {
        display: 'flex',
        padding: theme.spacing(2),
        alignItems: 'center',

        '& .search': {
          marginRight: theme.spacing(1),
          flexGrow: 1,
        },

        '& .add-button': {
          width: 40,
          height: 40,
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.default,
        },
      },
    },

    '& .note-preview': {
      width: 0,
      flexGrow: 1,
      borderLeft: `1px ${theme.palette.divider} solid`,
      display: 'flex',
      flexDirection: 'column',

      '&-title': {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px ${theme.palette.divider} solid`,

        '&-text': {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          '-webkit-line-clamp': 2,
          '-webkit-box-orient': 'vertical',
        },
      },

      '&-content': {
        width: '100%',
        height: 0,
        flexGrow: 1,
        overflowY: 'auto',

        '&-html': {
          padding: theme.spacing(2),
        },
      },

      '& .app-wrapper-padding': {
        paddingTop: 40,
      },

      '&.empty': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
      },
    },
  },
});
