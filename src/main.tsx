import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, styled, ThemeProvider } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { ptBR } from 'date-fns/locale';
import { MaterialDesignContent, SnackbarProvider } from 'notistack';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.tsx';
import { configureI18n } from './i18n';
import './index.css';
import EventNewPage from './pages/EventNew/index.tsx';
import EventEditPage from './pages/EventEdit/index.tsx';


configureI18n();

export const StyledMaterialDesignContent = styled(MaterialDesignContent)(
	() => ({
		'&.notistack-MuiContent-success': {
			backgroundColor: '#2D7738',
			fontFamily: 'Roboto'
		},
		'&.notistack-MuiContent-error': {
			backgroundColor: '#970C0C',
			fontFamily: 'Roboto'
		}
	})
);

const theme = createTheme({
	typography: {
		fontFamily: [
			'rawline',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif'
		].join(','),
	}
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<ThemeProvider theme={theme}>
		<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
			<SnackbarProvider
				Components={{
					success: StyledMaterialDesignContent,
					error: StyledMaterialDesignContent
				}}
			>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<App />}></Route>
						<Route path="/events" element={<EventNewPage />}></Route>
						<Route path="/events/:id" element={<EventEditPage />}></Route>
					</Routes>
				</BrowserRouter>
			</SnackbarProvider>
		</LocalizationProvider>
	</ThemeProvider>
);
