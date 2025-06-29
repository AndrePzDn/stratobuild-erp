import axios from "axios";

export class ErrorResponse extends Error {
  apiMessage: string;

  constructor(message: string, apiMessage: string) {
    super(message);
    this.name = "ErrorResponse";
    this.apiMessage = apiMessage;
  }
}

const GeneralErrorMessage =
  "Un error inesperado ha ocurrido. Por favor, inténtalo de nuevo más tarde.";

export const handleConnectionPetition = async <T>(
  callback: () => Promise<T>
): Promise<T> => {
  try {
    const res = await callback();
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw handleConnectionError(error);
    } else {
      throw new ErrorResponse("Unexpected error", GeneralErrorMessage);
    }
  }
};

const handleConnectionError = (error: Error): ErrorResponse => {
  if (!axios.isAxiosError(error))
    return new ErrorResponse(error.message, GeneralErrorMessage);

  if (!error.response)
    return new ErrorResponse(error.message, "No se pudo conectar al servidor.");

  if (error.response.status > 500)
    return new ErrorResponse(error.message, GeneralErrorMessage);

  console.error("Known Error", error);
  return new ErrorResponse(
    error.message,
    error.response?.data?.message || GeneralErrorMessage
  );
};
