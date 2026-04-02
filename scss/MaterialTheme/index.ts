import { common } from '@mui/material/colors';
import shadow from './shadow';
import typography from './typography';

/**
 * LIGHT THEME (DEFAULT)
 */
export const light = {
	palette: {
		type: 'light',
		background: {
			default: '#f4f6f8',
			paper: common.white,
		},
		primary: {
			contrastText: '#ffffff',
			main: '#E92C28',
		},
		secondary: {
			main: '#1646C1',
		},
		text: {
			primary: '#212121',
			secondary: '#616161',
			dark: common.black,
		},
	},
	components: {
		MuiTypography: {
			styleOverrides: {
				root: {
					letterSpacing: '0',
				},
			},
			defaultProps: {
				variantMapping: {
					h1: 'h1',
					h2: 'h2',
					h3: 'h3',
					h4: 'h4',
					h5: 'h5',
					h6: 'h6',
					subtitle1: 'p',
					subtitle2: 'p',
					subtitle3: 'p',
					body1: 'p',
					body2: 'p',
				},
			},
		},
		MuiLink: {
			styleOverrides: {
				root: {
					color: '#757575',
					textDecoration: 'none',
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: '#eee',
				},
			},
		},
		MuiBox: {
			styleOverrides: {
				root: {
					padding: '0',
				},
			},
			makeStyles: {
				root: {
					padding: 0,
				},
			},
			sx: {
				'&.MuiBox-root': {
					component: 'div',
				},
			},
		},
		MuiContainer: {
			styleOverrides: {
				root: {
					maxWidth: 'inherit',
					padding: '0',
					'@media (min-width: 600px)': {
						paddingLeft: 0,
						paddingRight: 0,
					},
				},
			},
		},
		MuiCssBaseline: {
			styleOverrides: {
				html: { height: '100%' },
				body: { background: '#fff', height: '100%', minHeight: '100%' },
				p: {
					margin: '0',
				},
			},
		},
		MuiAvatar: {
			styleOverrides: {
				root: {
					marginLeft: '0',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					color: '#212121',
					minWidth: 'auto',
					lineHeight: '1.2',
					boxShadow: 'none',
					ButtonText: {
						color: '#212121',
					},
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {},
			},
		},
		MuiListItemButton: {
			styleOverrides: {
				root: {
					padding: '0',
				},
			},
		},
		MuiList: {
			styleOverrides: {
				root: {
					padding: '0',
				},
			},
		},
		MuiListItem: {
			styleOverrides: {
				root: {
					MuiSelect: {
						backgroundColor: '#fafafa',
					},
					padding: '0',
				},
			},
		},
		MuiFormControl: {
			styleOverrides: {
				root: {
					width: '100%',
				},
			},
		},
		MuiFormControlLabel: {
			styleOverrides: {
				root: {
					marginRight: '0',
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				root: {
					color: '#eaeaea',
				},
				select: {
					textAlign: 'left',
				},
				icon: {
					color: '#a0a0a0',
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					color: '#a0a0a0',
					'&.Mui-focused': {
						color: '#d4af37',
					},
				},
			},
		},
		MuiMenu: {
			styleOverrides: {
				paper: {
					backgroundColor: '#1a1a1a',
					border: '1px solid rgba(212, 175, 55, 0.15)',
					borderRadius: '10px',
					boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
				},
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					padding: '8px 16px',
					fontFamily: '"Nunito", sans-serif',
					fontSize: '13px',
					color: '#a0a0a0',
					'&:hover': {
						backgroundColor: 'rgba(212, 175, 55, 0.08)',
						color: '#eaeaea',
					},
					'&.Mui-selected': {
						backgroundColor: 'rgba(212, 175, 55, 0.12)',
						color: '#d4af37',
						'&:hover': {
							backgroundColor: 'rgba(212, 175, 55, 0.16)',
						},
					},
					'&.Mui-disabled': {
						opacity: 0.35,
					},
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				root: {
					input: {},
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					height: '48px',
					width: '100%',
					backgroundColor: 'rgba(255, 255, 255, 0.04)',
					color: '#eaeaea',
					borderRadius: '10px',
					input: {
						color: '#eaeaea',
						'&::placeholder': {
							color: '#a0a0a0',
							opacity: 1,
						},
					},
					'& .MuiSvgIcon-root': {
						color: '#a0a0a0',
					},
					'&:hover .MuiOutlinedInput-notchedOutline': {
						borderColor: 'rgba(212, 175, 55, 0.4)',
					},
					'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
						borderColor: '#d4af37',
						borderWidth: '1px',
					},
					'&.Mui-disabled': {
						backgroundColor: 'rgba(255, 255, 255, 0.02)',
					},
				},
				notchedOutline: {
					borderColor: 'rgba(212, 175, 55, 0.2)',
				},
			},
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					margin: '5px 0 0 2px',
					lineHeight: '1.2',
				},
			},
		},
		MuiStepper: {
			styleOverrides: {
				root: {
					alignItems: 'center',
				},
			},
		},
		MuiTabPanel: {
			styleOverrides: {
				root: {
					padding: '0',
				},
			},
		},
		MuiSvgIcon: {
			styleOverrides: {
				root: {},
			},
		},
		MuiStepIcon: {
			styleOverrides: {
				root: {
					color: '#fff',
					borderRadius: '50%',
					border: '1px solid #eee',
				},
				text: {
					fill: '#bdbdbd',
				},
			},
		},
		MuiStepConnector: {
			styleOverrides: {
				line: {
					borderColor: '#eee',
				},
			},
		},
		MuiStepLabel: {
			styleOverrides: {
				label: {
					fontSize: '14px',
				},
			},
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					'&.Mui-checked': {
						color: 'black',
					},
				},
			},
		},
		MuiFab: {
			styleOverrides: {
				root: {
					width: '40px',
					height: '40px',
					background: '#fff',
					color: '#212121',
				},
				hover: {
					background: '#fff',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					MuiMenu: {
						boxShadow: 'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) -20px 20px 40px -4px',
					},
				},
			},
		},
		MuiAlert: {
			styleOverrides: {
				root: {
					boxShadow: 'none',
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					border: '1px solid #ddd',
					color: '#212121',
				},
			},
		},
	},
	shadow,
	typography,
};
