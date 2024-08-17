import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainMenu from '../MainMenu';

export default function MainBar() {
	const navigate = useNavigate();
	const [open, setOpen] = React.useState(false);

	const toggleMainMenu = (newOpen: boolean) => () => {
		setOpen(newOpen);
	};
	return (
		<AppBar position="static">
			<MainMenu open={open} toggleDrawer={toggleMainMenu} />
			<Toolbar>
				<IconButton
					onClick={toggleMainMenu(true)}
					size="large"
					edge="start"
					color="inherit"
					aria-label="menu"
					sx={{ mr: 2 }}
				>
					<MenuIcon />
				</IconButton>
				<Typography
					onClick={() => navigate('/')}
					variant="h6"
					component="div"
					sx={{ flexGrow: 1 }}
				>

					GDS - Ephem - Integrador
				</Typography>
			</Toolbar>
		</AppBar>
	);
}
