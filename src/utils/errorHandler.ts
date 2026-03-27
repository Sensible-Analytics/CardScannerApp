import { Alert } from "react-native";

interface ErrorWithCode {
  code?: string;
  message?: string;
}

const isErrorWithCode = (error: unknown): error is ErrorWithCode => {
  return typeof error === "object" && error !== null;
};

export const handleError = (error: unknown, context: string = "") => {
  if (!isErrorWithCode(error)) {
    console.error(`Error in ${context}:`, error);
    return "An unexpected error occurred";
  }

  console.error(`Error in ${context}:`, error);

  if (error.code) {
    return `Error ${error.code}: ${error.message}`;
  }

  if (error.message) {
    return error.message;
  }

  return "An unexpected error occurred";
};

export const showErrorAlert = (error: unknown, context: string = "") => {
  const message = handleError(error, context);
  Alert.alert("Error", message);
};

export default { handleError, showErrorAlert };
