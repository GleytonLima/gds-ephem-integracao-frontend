import React from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../../services/events.service';

const schema = z.object({
    eventoIntegracaoTemplate: z.string(),
    userId: z.number(),
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
        evento_pais_ocorrencia: z.string().min(1),
        evento_estado_ocorrencia: z.string().min(1),
        evento_cidade_ocorrencia: z.string().min(1),
    })
});

export type EventFormData = z.infer<typeof schema>;

interface EventFormProps {
    initialData?: Partial<EventFormData>;
}

const EventForm: React.FC<EventFormProps> = ({ initialData }) => {
    const navigate = useNavigate();
    const { control, getValues, handleSubmit, formState: { isValid, errors } } = useForm<EventFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            eventoIntegracaoTemplate: '/1',
            userId: 3,
            userEmail: '',
            userName: '',
            userPhone: '',
            userCountry: '',
            eventSourceId: "1",
            eventSourceLocation: '',
            eventSourceLocationId: 1,
            data: {
                evento_descricao: '',
                evento_detalhes: 'N',
                evento_qtde_envolvidos: 'apenas 1',
                evento_afetados: 'Ambiente',
                evento_sabe_quando_ocorreu: 'Sim',
                evento_data_ocorrencia: '',
                evento_local_ocorrencia: '',
                evento_pais_ocorrencia: '',
                evento_estado_ocorrencia: '',
                evento_cidade_ocorrencia: '',
            },
            ...initialData
        },
    });

    const { enqueueSnackbar } = useSnackbar();

    const onSubmit = async (data: EventFormData) => {
        if (!isValid) {
            console.error('Formulário inválido', errors);
            console.error('Valores do formulário', getValues());
            return;
        }

        try {
            const dataToSend = {
                ...data,
                data: {
                    ...data.data,
                    evento_data_ocorrencia: data.data.evento_data_ocorrencia.replace('T', ' ')
                }
            };
            await createEvent(dataToSend);
            
            enqueueSnackbar('Evento criado com sucesso!', { variant: 'success' });

            navigate('/');
        } catch (error) {
            enqueueSnackbar('Erro ao criar evento', { variant: 'error' });
        }
    };

    return (
        <>
            <Container>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4">Criar Novo Evento</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="eventoIntegracaoTemplate"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Integração Template"
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="userId"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Id do Usuário"
                                        fullWidth
                                        type='number'
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
                                name="eventSourceId"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Event Source Id"
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
                                        label="Id do Local do Event Source"
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
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
                                        rows={4}
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
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel id="evento_detalhes-select-label">Detalhes</InputLabel>
                                        <Select labelId="evento_detalhes-select-label" label="Detalhes" {...field}>
                                            <MenuItem value="S">Sim</MenuItem>
                                            <MenuItem value="N">Não</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="data.evento_qtde_envolvidos"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel id="evento_qtde_envolvidos-select-label">Quantidade de Envolvidos</InputLabel>
                                        <Select labelId="evento_qtde_envolvidos-select-label" label="Quantidade de Envolvidos" {...field}>
                                            <MenuItem value="apenas 1">Apenas 1</MenuItem>
                                            <MenuItem value="entre 2 e 5">Entre 2 e 5</MenuItem>
                                            <MenuItem value="mais de 5">Mais de 5</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="data.evento_afetados"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel id="evento_afetados-select-label">Afetados</InputLabel>
                                        <Select labelId="evento_afetados-select-label" label="Afetados" {...field}>
                                            <MenuItem value="Ambiente">Ambiente</MenuItem>
                                            <MenuItem value="Animais domésticos">Animais domésticos</MenuItem>
                                            <MenuItem value="Animais selvagens">Animais selvagens</MenuItem>
                                            <MenuItem value="Humanos">Humanos</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="data.evento_sabe_quando_ocorreu"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel id="evento_sabe_quando_ocorreu-select-label">Sabe quando ocorreu?</InputLabel>
                                        <Select labelId="evento_sabe_quando_ocorreu-select-label" label="Sabe quando ocorreu?" {...field}>
                                            <MenuItem value="Sim">Sim</MenuItem>
                                            <MenuItem value="Não">Não</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="data.evento_data_ocorrencia"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="Data de Ocorrência"
                                        type="datetime-local"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
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
                                name="data.evento_pais_ocorrencia"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <TextField
                                        {...field}
                                        label="País de Ocorrência"
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
                                    <TextField
                                        {...field}
                                        label="Estado de Ocorrência"
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                    />
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
                                        label="Cidade de Ocorrência"
                                        fullWidth
                                        error={!!error}
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Criar Evento
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </>
    );
};

export default EventForm;