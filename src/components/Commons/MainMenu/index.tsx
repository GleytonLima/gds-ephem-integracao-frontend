import { Toolbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../../../services/auth.service';
import { useNavigate } from 'react-router-dom';

export interface TemporaryDrawerProps {
	open: boolean;
	toggleDrawer: (
		open: boolean
	) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}
export default function MainMenu({
	open,
	toggleDrawer
}: TemporaryDrawerProps) {
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
			<Box
				sx={{ width: 250 }}
				role="presentation"
				onClick={toggleDrawer(false)}
				onKeyDown={toggleDrawer(false)}
			>
				<Toolbar sx={{ justifyContent: 'center' }}>
					<Typography variant="h6" component="div">
						GDS Ephem
					</Typography>
				</Toolbar>
				<Divider />
				<List>
					<ListItemButton component={Link} to="/">
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Início" />
					</ListItemButton>
					<ListItemButton component={Link} to="/events">
						<ListItemIcon>
							<AddCircleIcon />
						</ListItemIcon>
						<ListItemText primary="Novo Evento" />
					</ListItemButton>
					<ListItemButton component={Link} to="/users">
						<ListItemIcon>
							<PeopleIcon />
						</ListItemIcon>
						<ListItemText primary="Gerenciar Usuários" />
					</ListItemButton>
				</List>
				<Divider />
				<List>
					<ListItemButton onClick={handleLogout}>
						<ListItemIcon>
							<LogoutIcon />
						</ListItemIcon>
						<ListItemText primary="Sair" />
					</ListItemButton>
				</List>
			</Box>
		</Drawer>
	);
}
