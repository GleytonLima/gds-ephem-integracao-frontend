import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Modal,
  Tooltip,
  Typography,
  ButtonGroup,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridSortItem,
  GridSortModel,
  GridLoadingOverlay,
} from "@mui/x-data-grid";
import MainBar from "../../components/Commons/MainAppBar";
import { listEvents, reprocessEvent, copyEvent } from "../../services/events.service";
import { labelDisplayedRows } from "../../models/pagination-translate";
import { useTranslation } from "react-i18next";
import { SortParam } from "../../models/pagination";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ReplayIcon from "@mui/icons-material/Replay";
import { useSnackbar } from "notistack";

// Componente personalizado para o overlay de carregamento
function CustomLoadingOverlay() {
  return (
    <GridLoadingOverlay
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress color="primary" />
      <Typography variant="body2" sx={{ mt: 1 }}>
        Carregando eventos...
      </Typography>
    </GridLoadingOverlay>
  );
}

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
  eventSourceId: string;
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

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "800px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflow: "auto",
  borderRadius: 1,
};

const HomePage = () => {
  const [eventos, setEventos] = useState<{
    _embedded: { eventos: Evento[] };
    _links: { [key: string]: { href: string } };
    page: {
      size: number;
      totalElements: number;
      totalPages: number;
      number: number;
    };
  }>({
    _embedded: { eventos: [] },
    _links: {},
    page: { size: 10, totalElements: 0, totalPages: 0, number: 0 },
  });

  const [pageParams, setPageParams] = useState({ page: 0, pageSize: 10 });
  const [sortParams, setSortParams] = useState<GridSortItem[]>([
    { field: "updatedAt", sort: "desc" },
  ]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(
    null
  );
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [reprocessingId, setReprocessingId] = useState<number | null>(null);
  const [copyingId, setCopyingId] = useState<number | null>(null);

  const handlePageChange = (params: { page: number; pageSize: number }) => {
    const fixedSort: SortParam = {
      field: "updatedAt",
      sort: "desc",
    };
    let sortingParams: SortParam[] = sortParams.map((sort) => ({
      field: sort.field,
      sort: sort.sort === "asc" ? "asc" : "desc",
    }));
    sortingParams = sortingParams.length > 0 ? sortingParams : [fixedSort];
    setLoading(true);
    setPageParams(params);
    listEvents({
      limit: params.pageSize,
      offset: params.page,
      sortingParams: sortingParams,
    })
      .then((response) => {
        setEventos(response);
      })
      .catch((error) => {
        console.error(error);
        enqueueSnackbar("Erro ao carregar eventos", { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOpenModal = (evento: Evento) => {
    setEventoSelecionado(evento);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleNovoEvento = () => {
    navigate("/events");
  };

  const handleReprocessarEvento = async () => {
    if (!eventoSelecionado) return;
    
    setReprocessingId(eventoSelecionado.id);
    try {
      await reprocessEvent(eventoSelecionado.id);
      enqueueSnackbar('Evento enviado para reprocessamento com sucesso!', { variant: 'success' });
      handleCloseModal();
      // Recarregar a lista de eventos
      handlePageChange(pageParams);
    } catch (error) {
      console.error('Erro ao reprocessar evento:', error);
      enqueueSnackbar('Erro ao reprocessar evento', { variant: 'error' });
    } finally {
      setReprocessingId(null);
    }
  };

  const handleCopiarEvento = async () => {
    if (!eventoSelecionado) return;
    
    setCopyingId(eventoSelecionado.id);
    try {
      await copyEvent(eventoSelecionado.id);
      enqueueSnackbar('Evento copiado com sucesso!', { variant: 'success' });
      handleCloseModal();
      // Recarregar a lista de eventos
      handlePageChange(pageParams);
    } catch (error) {
      console.error('Erro ao copiar evento:', error);
      enqueueSnackbar('Erro ao copiar evento', { variant: 'error' });
    } finally {
      setCopyingId(null);
    }
  };

  const handleEditarEvento = () => {
    if (!eventoSelecionado) return;
    navigate(`/events/${eventoSelecionado.id}`);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString("pt-BR");
  };

  const handleSortChange = (
    model: GridSortModel,
    _: GridCallbackDetails<any>
  ) => {
    const fixedSort: SortParam = {
      field: "updatedAt",
      sort: "desc",
    };
    let sortingParams: SortParam[] = model.map((sort) => ({
      field: sort.field,
      sort: sort.sort === "asc" ? "asc" : "desc",
    }));

    sortingParams = sortingParams.length > 0 ? sortingParams : [fixedSort];

    setSortParams(model);
    setLoading(true);
    listEvents({
      limit: pageParams.pageSize,
      offset: pageParams.page,
      sortingParams: sortingParams,
    })
      .then((response) => {
        setEventos(response);
      })
      .catch((error) => {
        console.error(error);
        enqueueSnackbar("Erro ao ordenar eventos", { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handlePageChange({
      page: 0,
      pageSize: 10,
    });
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, sortable: false },
    {
      field: "createdAt",
      headerName: "Data de Envio",
      width: 180,
      renderCell: (params) => formatarData(params.value),
    },
    {
      field: "evento_descricao",
      headerName: "Evento",
      width: 200,
      flex: 1,
      renderCell: (params) => params.row.data.evento_descricao,
      sortable: false,
    },
    {
      field: "evento_data_ocorrencia",
      headerName: "Data de Ocorrência",
      width: 180,
      renderCell: (params) => params.row.data.evento_data_ocorrencia,
      sortable: false,
    },
    {
      field: "evento_local_ocorrencia",
      headerName: "Local de Ocorrência",
      width: 200,
      flex: 0.8,
      renderCell: (params) => params.row.data.evento_local_ocorrencia,
      sortable: false,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.row.statusMessage}>
          <Chip
            label={params.value}
            color={
              params.value === "PROCESSADO"
                ? "success"
                : params.value === "ERRO"
                ? "error"
                : "warning"
            }
            size="small"
          />
        </Tooltip>
      ),
      sortable: false,
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 100,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Button 
          variant="contained" 
          size="small" 
          onClick={() => handleOpenModal(params.row)}
        >
          <VisibilityIcon fontSize="small" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <MainBar />
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Eventos Recebidos</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNovoEvento}
            >
              Novo Evento
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ height: 'calc(100vh - 180px)', width: '100%', minHeight: 400, overflow: 'hidden' }}>
              <DataGrid
                rows={eventos._embedded.eventos}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: pageParams.pageSize,
                    },
                  },
                  sorting: {
                    sortModel: sortParams,
                  },
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                disableRowSelectionOnClick
                paginationMode="server"
                sortingMode="server"
                onSortModelChange={handleSortChange}
                rowCount={eventos.page.totalElements}
                paginationModel={{
                  page: pageParams.page,
                  pageSize: pageParams.pageSize,
                }}
                onPaginationModelChange={handlePageChange}
                loading={loading}
                slots={{
                  loadingOverlay: CustomLoadingOverlay,
                }}
                disableColumnMenu
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                disableColumnResize
                disableColumnSorting
                disableMultipleRowSelection
                getRowClassName={(params) => 
                  params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
                }
                sx={{
                  '& .even-row': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                  '& .odd-row': {
                    backgroundColor: 'white',
                  },
                  '& .MuiDataGrid-cell:focus-within': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-columnHeader:focus-within': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    fontWeight: 'bold',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '1px solid rgba(224, 224, 224, 1)',
                    padding: '8px 0',
                  },
                  '& .MuiDataGrid-main': {
                    marginTop: 0,
                    marginBottom: 0,
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    minHeight: '200px',
                  },
                  border: 'none',
                  height: '100%',
                }}
                localeText={{
                  MuiTablePagination: {
                    labelDisplayedRows: labelDisplayedRows,
                    labelRowsPerPage: t("Linhas por página:"),
                  },
                  noRowsLabel: "Nenhum evento encontrado",
                  noResultsOverlayLabel: "Nenhum resultado encontrado.",
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          {eventoSelecionado && (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
                Detalhes do Evento #{eventoSelecionado.id}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Status:</Typography>
                  <Chip
                    label={eventoSelecionado.status}
                    color={
                      eventoSelecionado.status === "PROCESSADO"
                        ? "success"
                        : eventoSelecionado.status === "ERRO"
                        ? "error"
                        : "warning"
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Mensagem de Status:</Typography>
                  <Typography>{eventoSelecionado.statusMessage || "N/A"}</Typography>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom>Dados do Evento</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Descrição:</Typography>
                  <Typography>{eventoSelecionado.data.evento_descricao}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Data de Ocorrência:</Typography>
                  <Typography>{eventoSelecionado.data.evento_data_ocorrencia}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Local:</Typography>
                  <Typography>{eventoSelecionado.data.evento_local_ocorrencia}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Cidade/Estado:</Typography>
                  <Typography>
                    {eventoSelecionado.data.evento_cidade_ocorrencia}/{eventoSelecionado.data.evento_estado_ocorrencia}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold">Detalhes:</Typography>
                  <Typography>{eventoSelecionado.data.evento_detalhes}</Typography>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom>Dados do Usuário</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">ID do Usuário:</Typography>
                  <Typography>{eventoSelecionado.userId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Nome:</Typography>
                  <Typography>{eventoSelecionado.userName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">E-mail:</Typography>
                  <Typography>{eventoSelecionado.userEmail}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Telefone:</Typography>
                  <Typography>{eventoSelecionado.userPhone}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">País:</Typography>
                  <Typography>{eventoSelecionado.userCountry}</Typography>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom>Dados de Integração</Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Event Source ID:</Typography>
                  <Typography>{eventoSelecionado.eventSourceId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Local do Event Source:</Typography>
                  <Typography>{eventoSelecionado.eventSourceLocation}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">ID do Local do Event Source:</Typography>
                  <Typography>{eventoSelecionado.eventSourceLocationId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Signal ID:</Typography>
                  <Typography>{eventoSelecionado.signalId}</Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <ButtonGroup variant="contained">
                  {eventoSelecionado.status === "ERRO" && (
                    <Button 
                      color="warning" 
                      onClick={handleReprocessarEvento}
                      startIcon={<ReplayIcon />}
                      disabled={reprocessingId === eventoSelecionado.id}
                    >
                      {reprocessingId === eventoSelecionado.id ? 'Reprocessando...' : 'Reprocessar'}
                    </Button>
                  )}
                  
                  {eventoSelecionado.status === "PROCESSADO" && (
                    <Button 
                      color="info" 
                      onClick={handleCopiarEvento}
                      startIcon={<ContentCopyIcon />}
                      disabled={copyingId === eventoSelecionado.id}
                    >
                      {copyingId === eventoSelecionado.id ? 'Copiando...' : 'Copiar'}
                    </Button>
                  )}
                  
                  <Button 
                    color="primary" 
                    onClick={handleEditarEvento}
                    startIcon={<EditIcon />}
                  >
                    Editar
                  </Button>
                  
                  <Button onClick={handleCloseModal}>Fechar</Button>
                </ButtonGroup>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default HomePage;
