import { useToast } from "vue-toastification";
const toast = useToast();

function getToastError(message: any) {
  const msg = message ? message : "Error";
  return toast.error(msg);
}

function getToastSuccess(message?: string) {
  const msg = message ? message : "Success";
  return toast.success(msg);
}

function getToastInfo(message?: string) {
  const msg = message ? message : "Info";
  return toast.info(msg);
}
export { getToastError, getToastSuccess, getToastInfo };
