import type { LoginFormValues } from "@/schemas/Login.schema";
import axios from "axios"

const BASE_URL = "/api";

export const loginUser = (values: LoginFormValues) => {
  return axios.post(`${BASE_URL}/login?timestamp=${new Date().getTime()}`, values);
}

export const readEntity = (entity: string, id: string, token: string) => {
  return axios.get(`${BASE_URL}/${entity}/read/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
}

export const listAllEntity = (entity: string, token: string) => {
  return axios.get(`${BASE_URL}/${entity}/list`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
}

export const listEntity = (entity: string, page: number, items: number, token: string) => {
  return axios.get(`${BASE_URL}/${entity}/list?page=${page}&items=${items}&q=enabled`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
}

export const deleteEntity = (entity: string, id: string, token: string) => {
  return axios.delete(`${BASE_URL}/${entity}/delete/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })
}

export const postEntity = (entity: string, data: any, token: string) => {
  return axios.post(`${BASE_URL}/${entity}/create`, data, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })
}

export const patchEntity = (entity: string, id: string, data: any, token: string) => {
  return axios.patch(`${BASE_URL}/${entity}/update/${id}`, data, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })
}

export const convertEntity = (entity: string, id: string, createdBy: string, token: string) => {
  return axios.post(`${BASE_URL}/${entity}/convert/${id}`, { createdBy: createdBy }, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })
}
