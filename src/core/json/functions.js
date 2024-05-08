import { currentusers, dateFormat } from "./api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import withReactContent from "sweetalert2-react-content";
dayjs.extend(customParseFormat);
import Swal from "sweetalert2";
const MySwal = withReactContent(Swal);

export const getCurrentUsersDetails = () => {
  const user = JSON.parse(sessionStorage.getItem(currentusers));

  return user;
};

export const getCurrentDate = () => {
  return dayjs().format(dateFormat);
};

export const showConfirmationAlert = (
  confirmationText,
  confirmationCallback,
  cancelCallback
) => {
  MySwal.fire({
    title: "Are you sure?",
    text: confirmationText || "You won't be able to revert this!",
    showCancelButton: true,
    confirmButtonColor: "#00ff00",
    confirmButtonText: "Yes",
    cancelButtonColor: "#ff0000",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      if (typeof confirmationCallback === "function") {
        confirmationCallback();
      }
    } else {
      if (typeof cancelCallback === "function") {
        cancelCallback();
      }
    }
  });
};

export function cancelCallback() {
  MySwal.close();
}
