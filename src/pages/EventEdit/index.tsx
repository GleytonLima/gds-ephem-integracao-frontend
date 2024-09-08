import React, { useEffect, useState } from 'react';
import MainBar from '../../components/Commons/MainAppBar';
import EventForm, { EventFormData } from '../../components/Events/EventForm';
import { useParams } from 'react-router-dom';
import { getEvent } from '../../services/events.service';


const EventEditPage: React.FC = () => {
    const [eventData, setEventData] = useState<Partial<EventFormData> | null>(null);
    const params = useParams()

    useEffect(() => {
        const fetchEventData = async () => {
            if (!params.id) {
                return;
            }
            const data = await getEvent(params.id);
            console.log(data);
            setEventData({
                ...data
            });
        };
        fetchEventData();
    }, []);

    if (!eventData) {
        return <div>Carregando...</div>;
    }

    return (
        <>
            <MainBar />
            <EventForm initialData={eventData} />
        </>
    );
};

export default EventEditPage;