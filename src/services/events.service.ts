import { EventFormData } from "../components/Events/EventForm";
import { QueryParam, SortParam } from "../models/pagination";
import api from "./api.config";

export const listEvents = async (pagination: {
  limit: number;
  offset: number;
  sortingParams?: SortParam[];
  queryParams?: QueryParam[];
}) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("size", pagination.limit.toString());
    queryParams.append("page", pagination.offset.toString());
    if (pagination.queryParams) {
      pagination.queryParams.forEach((queryItem) => {
        queryParams.append(`${queryItem.field}`, queryItem.value);
      });
    }
    if (pagination.sortingParams) {
      pagination.sortingParams.forEach((sortItem) => {
        queryParams.append("sort", `${sortItem.field},${sortItem.sort}`);
      });
    }
    const response = await api.get(`/api-integracao/v1/eventos?${queryParams}`);
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

export const createEvent = async (event: EventFormData) => {
  try {
    const response = await api.post(`/api-integracao/v1/eventos`, event);
    return response.data;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
