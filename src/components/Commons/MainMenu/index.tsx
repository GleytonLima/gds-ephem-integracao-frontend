import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { Toolbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

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
	const DrawerList = (
		<Box sx={{ width: 350 }} role="presentation">
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					<Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
						GDS-Ephem
					</Link>
				</Typography>
			</Toolbar>
			<Divider />
			<List>
				<ListItemButton component={Link} to="/">
					<ListItemIcon>
						<VolunteerActivismIcon />
					</ListItemIcon>
					<ListItemText primary="Eventos Recebidos" />
				</ListItemButton>
			</List>
		</Box>
	);

	return (
		<div>
			<Drawer open={open} onClose={toggleDrawer(false)}>
				{DrawerList}
			</Drawer>
		</div>
	);
}
