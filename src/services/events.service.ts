import { EventFormData } from '../components/Events/EventForm';
import { CustomPageRequest } from '../models/pagination';
import api from './api.config';

export const listEvents = async (pageRequest: CustomPageRequest) => {
    try {
        const response = await api.get(`/api-integracao/v1/eventos`, {
            params: {
                size: pageRequest.size,
                page: pageRequest.page - 1,
                sort: 'updatedAt,desc',
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
};

export const getEvent = async (id: string) => {
    try {
        const response = await api.get(`/api-integracao/v1/eventos/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
};

export const createEvent = async (
    event: EventFormData
) => {
    try {
        const response = await api.post(`/api-integracao/v1/eventos`, event);
        return response.data;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
};