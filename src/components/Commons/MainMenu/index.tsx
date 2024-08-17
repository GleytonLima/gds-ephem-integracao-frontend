import {
	AccountCircle,
	Assignment,
	Business,
	Category,
	ExpandLess,
	ExpandMore,
	Group
} from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import TableChartIcon from '@mui/icons-material/TableChart';
import TranslateIcon from '@mui/icons-material/Translate';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import WorkIcon from '@mui/icons-material/Work';
import { Collapse, Toolbar, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
	const { t } = useTranslation();

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
