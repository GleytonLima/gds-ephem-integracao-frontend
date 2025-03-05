import React, { useEffect, useState } from 'react';
import MainBar from '../../components/Commons/MainAppBar';
import EventForm, { EventFormData } from '../../components/Events/EventForm';
import { useParams } from 'react-router-dom';
import { getEvent } from '../../services/events.service';
import { CircularProgress, Container } from '@mui/material';

const EventEditPage: React.FC = () => {
    const [eventData, setEventData] = useState<Partial<EventFormData> | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        const fetchEventData = async () => {
            if (!params.id) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                const data = await getEvent(params.id);
                
                // Mapear os dados do evento para o formato esperado pelo formulário
                const formattedData: Partial<EventFormData> = {
                    eventoIntegracaoTemplate: '/1',
                    userId: data.userId,
                    userIntegrationId: data.userId,
                    userEmail: data.userEmail,
                    userName: data.userName,
                    userPhone: data.userPhone,
                    userCountry: data.userCountry,
                    eventSourceId: data.eventSourceId,
                    eventSourceLocation: data.eventSourceLocation,
                    eventSourceLocationId: data.eventSourceLocationId,
                    data: {
                        ...data.data
                    }
                };
                
                setEventData(formattedData);
            } catch (error) {
                console.error('Erro ao carregar dados do evento:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchEventData();
    }, [params.id]);

    if (loading) {
        return (
            <>
                <MainBar />
                <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Container>
            </>
        );
    }

    if (!eventData) {
        return (
            <>
                <MainBar />
                <Container sx={{ mt: 4 }}>
                    <div>Evento não encontrado ou erro ao carregar dados.</div>
                </Container>
            </>
        );
    }

    return (
        <>
            <MainBar />
            <EventForm initialData={eventData} />
        </>
    );
};

export default EventEditPage;