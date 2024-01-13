import { Theme, alpha } from '@mui/material';

export default (theme: Theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',

    '& .editor': {
      width: 0,
      height: '100%',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2),

      '& .canvas-container': {
        height: 0,
        flexGrow: 1,
        borderRadius: theme.shape.borderRadius,
        marginTop: theme.spacing(2),
        backgroundColor: theme.palette.text.secondary,
        overflow: 'hidden',
      },

      '&.app-wrapper-padding': {
        paddingTop: 40,
      },
    },

    '& .info': {
      width: 400,
      flexShrink: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.default,
      borderLeft: `1px ${theme.palette.divider} solid`,

      '&-controller': {
        padding: theme.spacing(2),
        borderBottom: `1px ${theme.palette.divider} solid`,

        '&.app-wrapper-padding': {
          paddingTop: 40,
        },

        '& .upload-button': {
          margin: `${theme.spacing(1)} 0 ${theme.spacing(2)} 0`,

          '& .input': {
            clip: 'rect(0 0 0 0)',
            clipPath: 'inset(50%)',
            overflow: 'hidden',
            position: 'absolute',
            top: 0,
            width: '100%',
            left: 0,
            height: '100%',
          },
        },
      },

      '&-title': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
      },

      '&-desc': {
        width: '100%',
      },

      '&-tag': {
        backgroundColor: theme.palette.background.paper,
        height: 0,
        flexGrow: 1,
        overflowY: 'auto',
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',

        '&-textarea': {
          fontFamily: 'Noto Sans SC Thin',
          fontWeight: 400,
          fontSize: '1rem',
          color: theme.palette.text.primary,
          borderRadius: theme.shape.borderRadius,
          borderStyle: 'solid',
          borderWidth: 1,
          borderColor: alpha(theme.palette.text.primary, 0.23),
          resize: 'none',
          width: '100%',
          marginTop: theme.spacing(2),
          padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
          height: 0,
          flexGrow: 1,

          '&:focus-visible': {
            outlineColor: theme.palette.primary.main,
          },
        },

        '&-gallery': {
          height: 120,
          borderRadius: theme.shape.borderRadius,
          overflow: 'auto',
          backgroundColor: theme.palette.text.secondary,
          display: 'flex',

          '&-inner': {
            width: '100%',
            height: '100%',
            display: 'flex',
            overflow: 'auto',
            padding: theme.spacing(1),
          },

          '&-item': {
            width: 100,
            height: '100%',
            borderRadius: theme.shape.borderRadius,
            objectFit: 'cover',
            flexShrink: 0,
            marginLeft: theme.spacing(1),
          },

          '&-button': {
            height: '100%',
            flexShrink: 0,

            '& .input': {
              clip: 'rect(0 0 0 0)',
              clipPath: 'inset(50%)',
              overflow: 'hidden',
              position: 'absolute',
              top: 0,
              width: '100%',
              left: 0,
              height: '100%',
            },
          },
        },
      },

      '&-button-group': {
        padding: theme.spacing(2),
        borderTop: `1px ${theme.palette.divider} solid`,
        display: 'flex',

        '&:first-child': {
          marginTop: 0,
        },

        '&:last-child': {
          marginBottom: 0,
        },

        '& .action-button': {
          width: 0,
          flexGrow: 1,
          color: theme.palette.common.white,

          '&:not(:last-child)': {
            marginRight: theme.spacing(1),
          },

          '&:not(:first-child)': {
            marginLeft: theme.spacing(1),
          },
        },
      },
    },
  },
});
