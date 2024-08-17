import React from 'react';
import MainBar from '../../components/Commons/MainAppBar';
import EventForm from '../../components/Events/EventForm';

const EventNewPage: React.FC = () => {
    return (
        <>
            <MainBar />
            <EventForm initialData={{}} />
        </>
    );
};

export default EventNewPage;