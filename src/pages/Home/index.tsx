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
} from "@mui/material";
import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridSortItem,
  GridSortModel,
} from "@mui/x-data-grid";
import MainBar from "../../components/Commons/MainAppBar";
import { listEvents } from "../../services/events.service";
import { labelDisplayedRows } from "../../models/pagination-translate";
import { useTranslation } from "react-i18next";
import useWindowDimensions from "../../hooks/window-dimensions";
import { SortParam } from "../../models/pagination";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%", // Alterado para 90% da largura
  maxWidth: "800px", // Adicionado um maxWidth para evitar que fique muito largo em telas grandes
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflowY: "auto", // Adicionado para permitir rolagem vertical se o conteúdo for muito grande
  maxHeight: "75vh", // Limitando a altura máxima para 90% da altura da viewport
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
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  const navigate = useNavigate();

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

  const handleReprocessarEvento = () => {
    console.log("Reprocessar Evento");
  };

  const handleEditarEvento = () => {
    console.log("Editar Evento");
    navigate(`/events/${eventoSelecionado?.id}`);
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
    { field: "id", headerName: "ID", width: 70 },
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
      renderCell: (params) => params.row.data.evento_descricao,
    },
    {
      field: "evento_data_ocorrencia",
      headerName: "Data de Ocorrência",
      width: 180,
      renderCell: (params) => params.row.data.evento_data_ocorrencia,
    },
    {
      field: "evento_local_ocorrencia",
      headerName: "Local de Ocorrência",
      width: 200,
      renderCell: (params) => params.row.data.evento_local_ocorrencia,
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
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
          />
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 120,
      renderCell: (params) => (
        <Button variant="contained" onClick={() => handleOpenModal(params.row)}>
          <VisibilityIcon />
        </Button>
      ),
    },
  ];

  return (
    <>
      <MainBar />
      <Container>
        <Box mt={2} textAlign={"left"}>
          <Typography variant="h4" gutterBottom mt={2}>
            Eventos
          </Typography>
        </Box>
        <Box mt={2} mb={2} textAlign={"right"}>
          <Button variant="contained" onClick={handleNovoEvento}>
            Novo Evento
          </Button>
        </Box>
        <DataGrid
          rows={eventos._embedded?.eventos ?? []}
          columns={columns}
          columnVisibilityModel={{
            id: true,
            createdAt: true,
            evento_descricao: width > 600,
            evento_data_ocorrencia: width > 600,
            evento_local_ocorrencia: width > 600,
            status: true,
            actions: width > 600,
          }}
          disableColumnMenu
          disableColumnResize
          loading={loading}
          paginationMode="server"
          sortingMode="server"
          rowCount={eventos.page.totalElements}
          pageSizeOptions={[5, 10, 50]}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: pageParams },
            sorting: { sortModel: sortParams },
          }}
          localeText={{
            noRowsLabel: t("VolunteerTable.noRowsLabel"),
            MuiTablePagination: {
              labelDisplayedRows,
            },
          }}
          onPaginationModelChange={handlePageChange}
          onSortModelChange={handleSortChange}
          onRowClick={(params) => {
            handleOpenModal(params.row);
          }}
        />
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
                <strong>Usuário Id:</strong> {eventoSelecionado?.userId}
                <br />
                <strong>Usuário Name:</strong> {eventoSelecionado?.userName}
                <br />
                <strong>Usuário Email:</strong> {eventoSelecionado?.userEmail}
                <br />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" component="div">
                <strong>Evento:</strong>{" "}
                {eventoSelecionado?.data.evento_descricao}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" component="div">
                <strong>Data de Ocorrência:</strong>{" "}
                {eventoSelecionado?.data.evento_data_ocorrencia}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" component="div">
                <strong>Local de Ocorrência:</strong>{" "}
                {eventoSelecionado?.data.evento_local_ocorrencia}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" component="div">
                <strong>Status:</strong> {eventoSelecionado?.status}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" component="div">
                <strong>Status Message:</strong>{" "}
                {eventoSelecionado?.statusMessage}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" component="div">
                <strong>Evento Afetados:</strong>{" "}
                {eventoSelecionado?.data.evento_afetados}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" component="div">
                <strong>Evento Detalhes:</strong>{" "}
                {eventoSelecionado?.data.evento_detalhes}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" component="div">
                <strong>Evento Quantidade Envolvidos:</strong>{" "}
                {eventoSelecionado?.data.evento_qtde_envolvidos}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" component="div">
                <strong>Evento Cidade Ocorrência:</strong>{" "}
                {eventoSelecionado?.data.evento_cidade_ocorrencia}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" component="div">
                <strong>Evento Estado Ocorrência:</strong>{" "}
                {eventoSelecionado?.data.evento_estado_ocorrencia}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleCloseModal}>
              Fechar
            </Button>
            {eventoSelecionado?.status === "ERRO" && (
              <>
                <Button
                  sx={{ ml: 2 }}
                  variant="contained"
                  onClick={handleReprocessarEvento}
                >
                  Reprocessar
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  variant="contained"
                  onClick={handleEditarEvento}
                >
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
