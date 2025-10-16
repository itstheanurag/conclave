import { toast } from "sonner";

export const toastSuccess = (
  message: string,
  id: string | number,
  description?: string
) => {
  return toast.success(message, {
    className:
      "alert alert-success shadow-lg rounded-lg text-base font-medium bg-base-300",
    description,
    id,
  });
};

export const toastError = (
  message: string,
  id: string | number,
  description?: string
) => {
  return toast.error(message, {
    className:
      "alert alert-error shadow-lg rounded-lg text-base font-medium bg-base-300",
    description,
    id,
  });
};

export const toastInfo = (
  message: string,
  id: string | number,
  description?: string
) => {
  return toast(message, {
    className:
      "alert alert-info shadow-lg rounded-lg text-base font-medium bg-base-300",
    description,
    id,
  });
};

export const toastLoading = (message: string) => {
  return toast.loading(message, {
    className:
      "alert alert-info shadow-lg rounded-lg text-base font-medium bg-base-300",
  });
};
