import { EventFormData } from "../components/Events/EventForm";
import { QueryParam, SortParam } from "../models/pagination";
import api from "./api.config";

// Dados mockados para eventos
const MOCK_EVENTS = [
  {
    id: 112,
    data: {
      evento_afetados: "Pessoas em geral",
      evento_detalhes: "As pessoas estão com muita gripe e tosse que não passa rapido",
      evento_descricao: "Pessoas doentes com sintomas parecidos",
      evento_data_ocorrencia: "08-02-2025",
      evento_qtde_envolvidos: "entre 2 e 5",
      evento_local_ocorrencia: "São Lourenço dos Órgãos, ",
      evento_cidade_ocorrencia: "SÃO LOURENÇO DOS ÓRGÃOS",
      evento_estado_ocorrencia: "SANTIAGO",
      evento_sabe_quando_ocorreu: "Sim"
    },
    aditionalData: {
      "Local": "São Lourenço dos Órgãos, ",
      "Cidade/Concelho": "SÃO LOURENÇO DOS ÓRGÃOS",
      "Estado/Distrito": "SANTIAGO",
      "Quando ocorreu?": "08-02-2025",
      "Quantos envolvidos?": "entre 2 e 5",
      "Sabe quando ocorreu?": "Sim",
      "Quem são os afetados?": "Pessoas em geral",
      "Deseja informar mais detalhes?": "As pessoas estão com muita gripe e tosse que não passa rapido",
      "Marque a opção que melhor descreve o que ocorreu:": "Pessoas doentes com sintomas parecidos"
    },
    status: "PROCESSADO",
    statusMessage: "signal criado com suceso com id: 263",
    signalId: 263,
    eventSourceId: "153356",
    eventSourceLocation: "",
    eventSourceLocationId: 0,
    userId: 49421,
    userIntegrationId: 12345,
    userEmail: "leilasamira395@gmail.com",
    userName: "Leila Samira Rodrigues Gonçalves ",
    userPhone: "+238 523 6513",
    userCountry: "Cabo Verde",
    createdAt: "2025-02-24T07:47:01.047276Z",
    updatedAt: "2025-02-24T07:47:04.882210Z",
  },
  {
    id: 2,
    data: {
      evento_afetados: "Pessoas em geral",
      evento_detalhes: "Detalhes do evento 2",
      evento_descricao: "Deslizamento de terra",
      evento_data_ocorrencia: "10-02-2025",
      evento_qtde_envolvidos: "entre 2 e 5",
      evento_local_ocorrencia: "Morro do Alemão",
      evento_cidade_ocorrencia: "Rio de Janeiro",
      evento_estado_ocorrencia: "RJ",
      evento_sabe_quando_ocorreu: "Sim"
    },
    aditionalData: {
      "Local": "Morro do Alemão",
      "Cidade/Concelho": "Rio de Janeiro",
      "Estado/Distrito": "RJ",
      "Quando ocorreu?": "10-02-2025",
      "Quantos envolvidos?": "entre 2 e 5",
      "Sabe quando ocorreu?": "Sim",
      "Quem são os afetados?": "Pessoas em geral",
      "Deseja informar mais detalhes?": "Detalhes do evento 2",
      "Marque a opção que melhor descreve o que ocorreu:": "Deslizamento de terra"
    },
    status: "ERRO",
    statusMessage: "Falha ao processar evento: dados incompletos",
    signalId: 102,
    eventSourceId: "153357",
    eventSourceLocation: "Zona Norte",
    eventSourceLocationId: 1002,
    userId: 49422,
    userIntegrationId: 12346,
    userEmail: "admin@test.com",
    userName: "Administrador",
    userPhone: "(21) 98765-4321",
    userCountry: "Brasil",
    createdAt: "2025-02-23T14:25:00.047276Z",
    updatedAt: "2025-02-23T14:30:00.882210Z",
  },
  {
    id: 3,
    data: {
      evento_afetados: "Pessoas em geral",
      evento_detalhes: "Detalhes do evento 3",
      evento_descricao: "Incêndio florestal",
      evento_data_ocorrencia: "12-02-2025",
      evento_qtde_envolvidos: "mais de 10",
      evento_local_ocorrencia: "Parque Nacional da Tijuca",
      evento_cidade_ocorrencia: "Rio de Janeiro",
      evento_estado_ocorrencia: "RJ",
      evento_sabe_quando_ocorreu: "Sim"
    },
    aditionalData: {
      "Local": "Parque Nacional da Tijuca",
      "Cidade/Concelho": "Rio de Janeiro",
      "Estado/Distrito": "RJ",
      "Quando ocorreu?": "12-02-2025",
      "Quantos envolvidos?": "mais de 10",
      "Sabe quando ocorreu?": "Sim",
      "Quem são os afetados?": "Pessoas em geral",
      "Deseja informar mais detalhes?": "Detalhes do evento 3",
      "Marque a opção que melhor descreve o que ocorreu:": "Incêndio florestal"
    },
    status: "PROCESSADO",
    statusMessage: "signal criado com suceso com id: 265",
    signalId: 265,
    eventSourceId: "153358",
    eventSourceLocation: "Zona Oeste",
    eventSourceLocationId: 1003,
    userId: 49423,
    userIntegrationId: 12347,
    userEmail: "usuario@test.com",
    userName: "Usuário Teste",
    userPhone: "(21) 91234-5678",
    userCountry: "Brasil",
    createdAt: "2025-02-22T09:20:00.047276Z",
    updatedAt: "2025-02-22T09:25:00.882210Z",
  },
];

// Função auxiliar para simular um atraso na resposta
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    // Simulação de chamada à API
    await delay(1000);

    // Criar um novo evento com ID único
    const newId =
      MOCK_EVENTS.length > 0
        ? Math.max(...MOCK_EVENTS.map((e) => e.id)) + 1
        : 1;

    // Usar eventSourceId como string
    const eventSourceId = event.eventSourceId || "153359";
    const eventSourceLocationId = event.eventSourceLocationId || 0;

    // Criar aditionalData com base nos dados do evento
    const aditionalData = {
      "Local": event.data.evento_local_ocorrencia,
      "Cidade/Concelho": event.data.evento_cidade_ocorrencia,
      "Estado/Distrito": event.data.evento_estado_ocorrencia,
      "Quando ocorreu?": event.data.evento_data_ocorrencia,
      "Quantos envolvidos?": event.data.evento_qtde_envolvidos,
      "Sabe quando ocorreu?": event.data.evento_sabe_quando_ocorreu,
      "Quem são os afetados?": event.data.evento_afetados,
      "Deseja informar mais detalhes?": event.data.evento_detalhes,
      "Marque a opção que melhor descreve o que ocorreu:": event.data.evento_descricao
    };

    const newEvent = {
      id: newId,
      data: event.data,
      aditionalData: aditionalData,
      status: "PROCESSADO",
      statusMessage: `signal criado com suceso com id: ${266 + newId}`,
      signalId: 266 + newId,
      eventSourceId: eventSourceId,
      eventSourceLocation: event.eventSourceLocation || "",
      eventSourceLocationId: eventSourceLocationId,
      userId: event.userId,
      userIntegrationId: event.userIntegrationId || 0,
      userEmail: event.userEmail,
      userName: event.userName,
      userPhone: event.userPhone,
      userCountry: event.userCountry,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Adicionar à lista de eventos mockados
    MOCK_EVENTS.push(newEvent);

    return newEvent;

    // Quando o backend estiver pronto, descomente o código abaixo
    // const response = await api.post(`/api-integracao/v1/eventos`, event);
    // return response.data;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

// Função para reprocessar um evento que falhou
export const reprocessEvent = async (id: number) => {
  try {
    // Simulação de chamada à API
    await delay(1000);

    // Encontrar o evento pelo ID
    const eventoIndex = MOCK_EVENTS.findIndex((e) => e.id === id);

    if (eventoIndex === -1) {
      throw new Error(`Evento com ID ${id} não encontrado`);
    }

    // Gerar um novo signalId
    const newSignalId = 266 + MOCK_EVENTS.length;

    // Atualizar o status do evento
    MOCK_EVENTS[eventoIndex] = {
      ...MOCK_EVENTS[eventoIndex],
      status: "PROCESSADO",
      statusMessage: `signal criado com suceso com id: ${newSignalId}`,
      signalId: newSignalId,
      updatedAt: new Date().toISOString(),
    };

    return MOCK_EVENTS[eventoIndex];

    // Quando o backend estiver pronto, descomente o código abaixo
    // const response = await api.post(`/api-integracao/v1/eventos/${id}/reprocessar`);
    // return response.data;
  } catch (error) {
    console.error("Erro ao reprocessar evento:", error);
    return Promise.reject(error);
  }
};

// Função para copiar um evento existente
export const copyEvent = async (id: number) => {
  try {
    // Simulação de chamada à API
    await delay(1000);

    // Encontrar o evento pelo ID
    const evento = MOCK_EVENTS.find((e) => e.id === id);

    if (!evento) {
      throw new Error(`Evento com ID ${id} não encontrado`);
    }

    // Criar um novo ID para o evento copiado
    const newId =
      MOCK_EVENTS.length > 0
        ? Math.max(...MOCK_EVENTS.map((e) => e.id)) + 1
        : 1;

    // Criar uma cópia do evento
    const newEvent = {
      ...evento,
      id: newId,
      status: "PROCESSADO",
      statusMessage: `signal criado com suceso com id: ${266 + newId}`,
      signalId: 266 + newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: {
        ...evento.data,
        evento_descricao: `Cópia de: ${evento.data.evento_descricao}`,
      },
      aditionalData: {
        ...evento.aditionalData,
        "Marque a opção que melhor descreve o que ocorreu:": `Cópia de: ${evento.data.evento_descricao}`,
      }
    };

    // Adicionar à lista de eventos mockados
    MOCK_EVENTS.push(newEvent);

    return newEvent;

    // Quando o backend estiver pronto, descomente o código abaixo
    // const originalEvent = await getEvent(id.toString());
    // const { id: _, createdAt, updatedAt, status, statusMessage, ...eventData } = originalEvent;
    // const response = await createEvent(eventData);
    // return response;
  } catch (error) {
    console.error("Erro ao copiar evento:", error);
    return Promise.reject(error);
  }
};
