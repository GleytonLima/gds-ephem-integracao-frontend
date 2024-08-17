import {
	Box,
	Button,
	Chip,
	Container,
	Grid,
	Modal,
	Pagination,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography
} from '@mui/material';
import MainBar from '../../components/Commons/MainAppBar';
import { useState, useEffect } from 'react';
import api from '../../services/api.config';
import { useNavigate } from 'react-router-dom';
import { listEvents } from '../../services/events.service';
import { CustomPagination } from '../../models/pagination';

interface Evento {
	id: number;
	data: {
		evento_afetados: string;
		evento_detalhes: string;
		evento_descricao: string;
		evento_data_ocorrencia: string;
		evento_qtde_envolvidos: string;
		evento_local_ocorrencia: string;
		evento_cidade_ocorrencia: string;
		evento_estado_ocorrencia: string;
		evento_sabe_quando_ocorreu: string;
	};
	aditionalData: {
		[key: string]: string;
	};
	status: string;
	statusMessage: string;
	signalId: number;
	eventSourceId: number;
	eventSourceLocation: string;
	eventSourceLocationId: number;
	userId: number;
	userEmail: string;
	userName: string;
	userPhone: string;
	userCountry: string;
	createdAt: string;
	updatedAt: string;
}

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4
};


const HomePage = () => {
	const [eventos, setEventos] = useState<Evento[]>([]);
	const [paginacao, setPaginacao] = useState<CustomPagination>({
		size: 10,
		totalElements: 0,
		totalPages: 0,
		number: 0,
	});

	useEffect(() => {
		listEvents({
			size: paginacao.size,
			page: paginacao.number - 1,
			sort: 'updatedAt,desc',
		}).then((response) => {
			setEventos(response._embedded.eventos);
			setPaginacao({
				size: response.data.page.size,
				totalElements: response.data.page.totalElements,
				totalPages: response.data.page.totalPages,
				number: response.data.page.number + 1,
			});
		}).catch((error) => {
			console.error(error);
		});
	}, [paginacao.number]);

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		console.log("event", event);
		console.log("value", value);
		setPaginacao((prevPaginacao) => ({ ...prevPaginacao, number: value }));
	};


	const [openModal, setOpenModal] = useState(false);
	const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null);

	const handleOpenModal = (evento: Evento) => {
		setEventoSelecionado(evento);
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const navigate = useNavigate();

	const handleNovoEvento = () => {
		navigate('/events');
	};

	const handleReprocessarEvento = () => {
		console.log('Reprocessar Evento');
	};

	const handleEditarEvento = () => {
		console.log('Editar Evento');
		navigate(`/events/${eventoSelecionado?.id}`);
	};

	// a seguinte função formata a data que chega por exmeplo como 2024-08-16T02:26:00.393785Z
	// para o formato brasileiro dd/mm/yyyy HH:mm:ss
	const formatarData = (data: string) => {
		const dataFormatada = new Date(data).toLocaleString('pt-BR');
		return dataFormatada;
	}
	

	return (
		<>
			<MainBar />
			<Container>
				<Box mt={2} textAlign={'left'}>
					<Typography variant="h4" gutterBottom mt={2}>
						Eventos
					</Typography>
				</Box>
				<Box mt={2} mb={2} textAlign={'right'}>
					<Button variant="contained" onClick={handleNovoEvento}>
						Novo Evento
					</Button>
				</Box>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>ID</TableCell>
								<TableCell>Data de Envio</TableCell>
								<TableCell>Evento</TableCell>
								<TableCell>Data de Ocorrência</TableCell>
								<TableCell>Local de Ocorrência</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Ações</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{eventos.map((evento) => (
								<TableRow key={evento.id}>
									<TableCell>{evento.id}</TableCell>
									<TableCell>{formatarData(evento.createdAt)}</TableCell>
									<TableCell>{evento.data.evento_descricao}</TableCell>
									<TableCell>{evento.data.evento_data_ocorrencia}</TableCell>
									<TableCell>{evento.data.evento_local_ocorrencia}</TableCell>
									<TableCell>
										<Tooltip title={evento.statusMessage}>
											<Chip
												label={evento.status}
												color={
													evento.status === 'PROCESSADO'
														? 'success'
														: evento.status === 'ERRO'
															? 'error'
															: 'warning'
												}
											/>
										</Tooltip>
									</TableCell>
									<TableCell>
										<Button variant="contained" onClick={() => handleOpenModal(evento)}>
											Detalhes
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Pagination
						count={paginacao.totalPages}
						page={paginacao.number}
						onChange={handlePageChange}
					/>
				</TableContainer>
			</Container>
			<Modal
				open={openModal}
				onClose={handleCloseModal}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Detalhes do Evento
					</Typography>
					<Grid container spacing={2} sx={{ mt: 2 }}>
						<Grid item xs={12}>
							<Typography variant="body1" component="div">
								<strong>Evento:</strong> {eventoSelecionado?.data.evento_descricao}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1" component="div">
								<strong>Data de Ocorrência:</strong> {eventoSelecionado?.data.evento_data_ocorrencia}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1" component="div">
								<strong>Local de Ocorrência:</strong> {eventoSelecionado?.data.evento_local_ocorrencia}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1" component="div">
								<strong>Status:</strong> {eventoSelecionado?.status}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1" component="div">
								<strong>Status Message:</strong> {eventoSelecionado?.statusMessage}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1" component="div">
								<strong>Evento Afetados:</strong> {eventoSelecionado?.data.evento_afetados}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1" component="div">
								<strong>Evento Detalhes:</strong> {eventoSelecionado?.data.evento_detalhes}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1" component="div">
								<strong>Evento Quantidade Envolvidos:</strong> {eventoSelecionado?.data.evento_qtde_envolvidos}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1" component="div">
								<strong>Evento Cidade Ocorrência:</strong> {eventoSelecionado?.data.evento_cidade_ocorrencia}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1" component="div">
								<strong>Evento Estado Ocorrência:</strong> {eventoSelecionado?.data.evento_estado_ocorrencia}
							</Typography>
						</Grid>
					</Grid>
					<Grid container spacing={2} sx={{ mt: 2 }}>
						<Button variant="contained" onClick={handleCloseModal}>
							Fechar
						</Button>
						{eventoSelecionado?.status === 'ERRO' && (
							<>
								<Button sx={{ ml: 2 }} variant="contained" onClick={handleReprocessarEvento}>
									Reprocessar
								</Button>
								<Button sx={{ ml: 2 }} variant="contained" onClick={handleEditarEvento}>
									Editar
								</Button>
							</>
						)}
					</Grid>
				</Box>
			</Modal>
		</>
	);
};

export default HomePage;
