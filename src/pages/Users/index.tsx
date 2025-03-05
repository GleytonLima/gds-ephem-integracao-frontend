import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSnackbar } from 'notistack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MainBar from '../../components/Commons/MainAppBar';
import { User, addUser, getAllUsers, updateUser, deleteUser } from '../../services/indexeddb.service';

// Esquema de validação do formulário
const userSchema = z.object({
  id: z.number().optional(),
  integrationId: z.number().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  country: z.string().min(1, 'País é obrigatório')
});

type UserFormData = z.infer<typeof userSchema>;

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: undefined,
      integrationId: undefined,
      name: '',
      email: '',
      phone: '',
      country: ''
    }
  });

  // Carregar usuários
  const loadUsers = async () => {
    setLoading(true);
    try {
      const userList = await getAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      enqueueSnackbar('Erro ao carregar usuários', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Abrir diálogo para adicionar/editar usuário
  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      reset({
        id: user.id,
        integrationId: user.integrationId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country
      });
    } else {
      setEditingUser(null);
      reset({
        id: undefined,
        integrationId: undefined,
        name: '',
        email: '',
        phone: '',
        country: ''
      });
    }
    setOpenDialog(true);
  };

  // Fechar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Salvar usuário (adicionar ou atualizar)
  const onSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        // Atualizar usuário existente
        await updateUser({
          ...data,
          id: editingUser.id
        });
        enqueueSnackbar('Usuário atualizado com sucesso!', { variant: 'success' });
      } else {
        // Adicionar novo usuário
        await addUser(data);
        enqueueSnackbar('Usuário adicionado com sucesso!', { variant: 'success' });
      }
      handleCloseDialog();
      loadUsers();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      enqueueSnackbar('Erro ao salvar usuário', { variant: 'error' });
    }
  };

  // Confirmar exclusão de usuário
  const handleConfirmDelete = (user: User) => {
    setUserToDelete(user);
    setConfirmDeleteDialog(true);
  };

  // Excluir usuário
  const handleDeleteUser = async () => {
    if (!userToDelete || !userToDelete.id) return;
    
    try {
      await deleteUser(userToDelete.id);
      enqueueSnackbar('Usuário excluído com sucesso!', { variant: 'success' });
      setConfirmDeleteDialog(false);
      loadUsers();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      enqueueSnackbar('Erro ao excluir usuário', { variant: 'error' });
    }
  };

  return (
    <>
      <MainBar />
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Gerenciar Usuários</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => handleOpenDialog()}
            >
              Adicionar Usuário
            </Button>
          </Grid>
          
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>ID de Integração</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>E-mail</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell>País</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Nenhum usuário cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.integrationId}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.country}</TableCell>
                        <TableCell align="center">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenDialog(user)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleConfirmDelete(user)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>

      {/* Diálogo para adicionar/editar usuário */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuário' : 'Adicionar Usuário'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="id"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ID"
                      fullWidth
                      disabled={!!editingUser}
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="integrationId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ID de Integração"
                      fullWidth
                      disabled={!!editingUser}
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nome"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="E-mail"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Telefone"
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="País"
                      fullWidth
                      error={!!errors.country}
                      helperText={errors.country?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              Salvar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={confirmDeleteDialog} onClose={() => setConfirmDeleteDialog(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o usuário {userToDelete?.name}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersPage; 