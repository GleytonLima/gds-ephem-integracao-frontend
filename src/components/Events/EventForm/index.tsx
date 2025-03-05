import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSnackbar } from 'notistack';
import {
    TextField,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Grid,
    Typography,
    Container,
    FormHelperText,
    CircularProgress,
    Autocomplete,
    Tooltip,
    IconButton,
    Box
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../../services/events.service';
import { User, getAllUsers, addUser } from '../../../services/indexeddb.service';
import SaveIcon from '@mui/icons-material/Save';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Lista de estados brasileiros
const estados = [
    'SANTIAGO', 'SANTO ANTÃO', 'SÃO VICENTE', 'SÃO NICOLAU', 'SAL', 'BOA VISTA', 'MAIO', 'FOGO', 'BRAVA'
];

// Opções para campos de seleção
const simNaoOptions = ['Sim', 'Não'];
const afetadosOptions = ['Pessoas em geral', 'Animais', 'Ambiente', 'Outros'];
const qtdeEnvolvidosOptions = ['apenas 1', 'entre 2 e 5', 'entre 6 e 10', 'mais de 10'];

const schema = z.object({
    eventoIntegracaoTemplate: z.string(),
    userId: z.number(),
    userIntegrationId: z.number().optional(),
    userEmail: z.string().email(),
    userName: z.string().min(1),
    userPhone: z.string().min(1),
    userCountry: z.string().min(1),
    eventSourceId: z.string().min(1).optional(),
    eventSourceLocation: z.string().min(1).optional(),
    eventSourceLocationId: z.number().min(1).optional(),
    data: z.object({
        evento_descricao: z.string().min(1),
        evento_detalhes: z.string().min(1),
        evento_qtde_envolvidos: z.string().min(1),
        evento_afetados: z.string().min(1),
        evento_sabe_quando_ocorreu: z.string().min(1),
        evento_data_ocorrencia: z.string().min(1),
        evento_local_ocorrencia: z.string().min(1),
        evento_estado_ocorrencia: z.string().min(1),
        evento_cidade_ocorrencia: z.string().min(1),
    })
});

export type EventFormData = z.infer<typeof schema>;

interface EventFormProps {
    initialData?: Partial<EventFormData>;
}

const EventForm = ({ initialData = {} }: EventFormProps) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [savingUser, setSavingUser] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { enqueueSnackbar } = useSnackbar();
    
    const { control, setValue, getValues, handleSubmit, watch, formState: { isValid, errors }, reset } = useForm<EventFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            eventoIntegracaoTemplate: '/1',
            userId: 0,
            userIntegrationId: undefined,
            userEmail: '',
            userName: '',
            userPhone: '',
            userCountry: '',
            eventSourceId: "",
            eventSourceLocation: '',
            eventSourceLocationId: 0,
            data: {
                evento_descricao: '',
                evento_detalhes: '',
                evento_qtde_envolvidos: 'entre 2 e 5',
                evento_afetados: 'Pessoas em geral',
                evento_sabe_quando_ocorreu: 'Sim',
                evento_data_ocorrencia: '',
                evento_local_ocorrencia: '',
                evento_estado_ocorrencia: 'SANTIAGO',
                evento_cidade_ocorrencia: '',
            }
        },
        mode: 'onChange'
    });

    // Observar os campos do usuário para habilitar/desabilitar o botão de salvar
    const userName = watch('userName');
    const userEmail = watch('userEmail');
    const userPhone = watch('userPhone');
    const userCountry = watch('userCountry');
    const userIntegrationId = watch('userIntegrationId');

    // Carregar usuários do IndexedDB
    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            try {
                const userList = await getAllUsers();
                setUsers(userList);
                
                // Se temos dados iniciais com userId, encontrar o usuário correspondente
                if (initialData?.userId) {
                    debugger
                    const user = userList.find(u => u.integrationId === initialData.userId);
                    if (user) {
                        setSelectedUser(user);
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar usuários:', error);
                enqueueSnackbar('Erro ao carregar usuários do banco de dados local', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };
        
        loadUsers();
    }, [initialData, enqueueSnackbar]);

    // Carregar os dados iniciais quando disponíveis
    useEffect(() => {
        if (Object.keys(initialData).length > 0) {
            reset(initialData);
            
            // Se tiver dados de usuário, criar um objeto de usuário selecionado
            if (initialData.userId && initialData.userName) {
                const user: User = {
                    id: initialData.userId,
                    name: initialData.userName || '',
                    email: initialData.userEmail || '',
                    phone: initialData.userPhone || '',
                    country: initialData.userCountry || '',
                    integrationId: initialData.userId
                };
                setSelectedUser(user);
            }
        }
    }, [initialData, reset]);

    // Atualizar campos do usuário quando um usuário é selecionado
    const handleUserChange = (user: User | null) => {
        setSelectedUser(user);
        if (user) {
            setValue('userId', user.id || 0);
            setValue('userName', user.name);
            setValue('userEmail', user.email);
            setValue('userPhone', user.phone);
            setValue('userCountry', user.country);
            setValue('userIntegrationId', user.integrationId);
        } else {
            setValue('userId', 0);
            setValue('userName', '');
            setValue('userEmail', '');
            setValue('userPhone', '');
            setValue('userCountry', '');
            setValue('userIntegrationId', undefined);
        }
    };

    // Salvar o usuário atual no IndexedDB
    const handleSaveUser = async () => {
        // Verificar se os campos obrigatórios estão preenchidos
        if (!userName || !userEmail || !userPhone || !userCountry) {
            enqueueSnackbar('Preencha todos os campos do usuário antes de salvar', { variant: 'warning' });
            return;
        }

        // Verificar se já existe um usuário com o mesmo email
        const existingUser = users.find(u => u.email === userEmail);
        if (existingUser) {
            enqueueSnackbar('Já existe um usuário com este e-mail', { variant: 'warning' });
            return;
        }

        setSavingUser(true);
        try {
            const newUser: User = {
                name: userName,
                email: userEmail,
                phone: userPhone,
                country: userCountry,
                integrationId: userIntegrationId
            };
            
            const userId = await addUser(newUser);
            
            // Atualizar a lista de usuários
            const updatedUsers = [...users, { ...newUser, id: userId }];
            setUsers(updatedUsers);
            
            // Selecionar o usuário recém-criado
            const createdUser = { ...newUser, id: userId };
            setSelectedUser(createdUser);
            setValue('userId', userId);
            
            enqueueSnackbar('Usuário salvo com sucesso!', { variant: 'success' });
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            enqueueSnackbar('Erro ao salvar usuário', { variant: 'error' });
        } finally {
            setSavingUser(false);
        }
    };

    const onSubmit = async (data: EventFormData) => {
        if (!isValid) {
            console.error('Formulário inválido', errors);
            console.error('Valores do formulário', getValues());
            return;
        }

        setSubmitting(true);
        try {
            // Formatar a data no formato DD-MM-YYYY
            const date = new Date(data.data.evento_data_ocorrencia);
            const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
            
            const dataToSend = {
                ...data,
                data: {
                    ...data.data,
                    evento_data_ocorrencia: formattedDate
                }
            };
            await createEvent(dataToSend);
            
            enqueueSnackbar('Evento criado com sucesso!', { variant: 'success' });

            navigate('/');
        } catch (error) {
            enqueueSnackbar('Erro ao criar evento', { variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    // Verificar se os campos do usuário estão preenchidos para habilitar o botão de salvar
    const canSaveUser = userName && userEmail && userPhone && userCountry && !users.some(u => u.email === userEmail);

    return (
        <>
            <Container>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4">Criar Novo Evento</Typography>
                        </Grid>

                        {/* Seção de Usuário */}
                        <Grid item xs={12}>
                            <Box display="flex" alignItems="center">
                                <Typography variant="h6">Dados do Usuário</Typography>
                                <Tooltip title="Salvar usuário atual no banco de dados">
                                    <span>
                                        <IconButton 
                                            color="primary" 
                                            onClick={handleSaveUser} 
                                            disabled={!canSaveUser || savingUser}
                                            sx={{ ml: 2 }}
                                        >
                                            {savingUser ? <CircularProgress size={24} /> : <PersonAddIcon />}
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Autocomplete
                                options={users}
                                getOptionLabel={(option) => `${option.name} (${option.email})`}
                                value={selectedUser}
                                onChange={(_, newValue) => handleUserChange(newValue)}
                                loading={loading}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Selecionar Usuário"
                                        fullWidth
                                        helperText="Selecione um usuário cadastrado ou preencha os campos manualmente"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="userName"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Nome do Usuário"
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="userEmail"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="E-mail do Usuário"
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="userPhone"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Telefone do Usuário"
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="userCountry"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="País do Usuário"
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="userIntegrationId"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="ID de Integração do Usuário"
                                        fullWidth
                                        type="number"
                                        InputLabelProps={{ shrink: true }}
                                        value={field.value || ''}
                                        onChange={(e) => {
                                            const value = e.target.value === '' ? undefined : Number(e.target.value);
                                            field.onChange(value);
                                        }}
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Seção de Dados de Integração */}
                        <Grid item xs={12}>
                            <Typography variant="h6">Dados de Integração</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="eventSourceId"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Event Source ID"
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="eventSourceLocation"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Local do Event Source"
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="eventSourceLocationId"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="ID do Local do Event Source"
                                        type="number"
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Seção de Evento */}
                        <Grid item xs={12}>
                            <Typography variant="h6">Dados do Evento</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="data.evento_descricao"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Descrição do Evento"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="data.evento_sabe_quando_ocorreu"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <FormControl fullWidth error={!!error}>
                                        <InputLabel>Sabe quando ocorreu?</InputLabel>
                                        <Select {...field} label="Sabe quando ocorreu?">
                                            {simNaoOptions.map(option => (
                                                <MenuItem key={option} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                        {error && <FormHelperText>{error.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="data.evento_data_ocorrencia"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <DateTimePicker
                                        label="Data de Ocorrência"
                                        value={field.value ? new Date(field.value) : null}
                                        onChange={(date) => {
                                            if (date) {
                                                const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
                                                field.onChange(formattedDate);
                                            }
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!error,
                                                helperText: error?.message
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="data.evento_afetados"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <FormControl fullWidth error={!!error}>
                                        <InputLabel>Afetados</InputLabel>
                                        <Select {...field} label="Afetados">
                                            {afetadosOptions.map(option => (
                                                <MenuItem key={option} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                        {error && <FormHelperText>{error.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="data.evento_qtde_envolvidos"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <FormControl fullWidth error={!!error}>
                                        <InputLabel>Quantidade de Envolvidos</InputLabel>
                                        <Select {...field} label="Quantidade de Envolvidos">
                                            {qtdeEnvolvidosOptions.map(option => (
                                                <MenuItem key={option} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                        {error && <FormHelperText>{error.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="data.evento_local_ocorrencia"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Local de Ocorrência"
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="data.evento_estado_ocorrencia"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <FormControl fullWidth error={!!error}>
                                        <InputLabel>Estado</InputLabel>
                                        <Select {...field} label="Estado">
                                            {estados.map(estado => (
                                                <MenuItem key={estado} value={estado}>{estado}</MenuItem>
                                            ))}
                                        </Select>
                                        {error && <FormHelperText>{error.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Controller
                                name="data.evento_cidade_ocorrencia"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Cidade"
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="data.evento_detalhes"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Detalhes do Evento"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary" 
                                size="large"
                                fullWidth
                                disabled={submitting}
                                startIcon={submitting ? <CircularProgress size={24} /> : <SaveIcon />}
                            >
                                {submitting ? 'Salvando...' : 'Salvar Evento'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </>
    );
};

export default EventForm;