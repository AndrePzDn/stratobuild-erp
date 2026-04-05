import type { LoginFormValues } from "@/schemas/Login.schema";
import type { Entity } from "@/types";
import { toast } from "react-toastify";
import axios from "axios";
import { ErrorResponse, handleConnectionPetition } from "./errorHandler";
import type { UpdatePasswordSchemaType } from "@/pages/UpdatePassword/schemas/updatePassword.schema";

const BASE_URL = "/backend-erp";

export const loginUser = (values: LoginFormValues) => {
  return axios.post(
    `${BASE_URL}/login?timestamp=${new Date().getTime()}`,
    values
  );
};

export const logoutUser = (token: string) => {
  return axios.post(
    `${BASE_URL}/logout?timestamp=${new Date().getTime()}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updatePassword = (
  token: string,
  data: UpdatePasswordSchemaType
) => {
  return axios.patch(
    `${BASE_URL}/admin/profile/password`,
    {
      ...data,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
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
  token: string,
  params?: Record<string, string | number>
) => {
  return axios.get(`${BASE_URL}/${entity}/list?page=${page}&items=${items}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });
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

  if (!res) {
    return;
  }
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
    axios
      .post(
        `${BASE_URL}/${entity}/convert/${id}`,
        { createdBy: createdBy },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((error) => {
        if (error instanceof ErrorResponse) {
          toast.error(error.apiMessage);
        } else {
          console.error("Unexpected error:", error);
        }
      })
  );

  if (!res) {
    toast.error("Error al convertir la entidad");
    return;
  }
  toast.success("Conversión exitosa");
};

export const sendMail = async (entity: string, id: string, token: string) => {
  toast.promise(
    axios.post(
      `${BASE_URL}/${entity}/mail/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
    {
      pending: "Enviando correo...",
      success: "Correo enviado exitosamente",
    }
  );
};

export const importEntity = async (entity: string, file: File, token: string) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await handleConnectionPetition(() =>
    axios.post(`${BASE_URL}/${entity}/import`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
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
  
  const result = res.data.result;
  if (result.errors && result.errors.length > 0) {
    toast.warning(`Importó ${result.importedCount} registros. Fallaron ${result.errors.length} filas.`);
  } else {
    toast.success("Importación exitosa");
  }
  return res;
};
