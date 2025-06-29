import type { LoginFormValues } from "@/schemas/Login.schema";
import type { Entity } from "@/types";
import { toast } from "react-toastify";
import axios from "axios";
import { ErrorResponse, handleConnectionPetition } from "./errorHandler";

const BASE_URL = "/api";

export const loginUser = (values: LoginFormValues) => {
  return axios.post(
    `${BASE_URL}/login?timestamp=${new Date().getTime()}`,
    values
  );
};

export const readEntity = (entity: string, id: string, token: string) => {
  return axios.get(`${BASE_URL}/${entity}/read/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listAllEntity = (entity: string, token: string) => {
  return axios.get(`${BASE_URL}/${entity}/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listEntity = (
  entity: string,
  page: number,
  items: number,
  token: string
) => {
  return axios.get(
    `${BASE_URL}/${entity}/list?page=${page}&items=${items}&q=enabled`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteEntity = async (
  entity: string,
  id: string,
  token: string
) => {
  const res = await handleConnectionPetition(() =>
    axios.delete(`${BASE_URL}/${entity}/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).catch((error) => {
    if (error instanceof ErrorResponse) {
      toast.error(error.apiMessage);
    } else {
      console.error("Unexpected error:", error);
    }
  });

  if (!res) {
    return;
  }
  toast.success("Eliminación exitosa");
};

export const postEntity = async (
  entity: string,
  data: Partial<Omit<Entity, "_id">>,
  token: string
) => {
  const res = await handleConnectionPetition(() =>
    axios.post(`${BASE_URL}/${entity}/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).catch((error) => {
    if (error instanceof ErrorResponse) {
      toast.error(error.apiMessage);
    } else {
      console.error("Unexpected error:", error);
    }
  });

  toast.success("Creación exitosa");
  return res;
};

export const patchEntity = async (
  entity: string,
  id: string,
  data: Partial<Entity>,
  token: string
) => {
  const res = await handleConnectionPetition(() =>
    axios.patch(`${BASE_URL}/${entity}/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).catch((error) => {
    if (error instanceof ErrorResponse) {
      toast.error(error.apiMessage);
    } else {
      console.error("Unexpected error:", error);
    }
  });

  toast.success("Actualización exitosa");
  return res;
};

export const convertEntity = async (
  entity: string,
  id: string,
  createdBy: string,
  token: string
) => {
  const res = await handleConnectionPetition(() =>
    axios.post(
      `${BASE_URL}/${entity}/convert/${id}`,
      { createdBy: createdBy },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );

  if (!res) {
    return;
  }
  toast.success("Conversión exitosa");
};
