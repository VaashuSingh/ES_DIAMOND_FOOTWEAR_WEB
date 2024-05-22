import { apiUrl, currentusers, dateFormat } from "./api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import withReactContent from "sweetalert2-react-content";
dayjs.extend(customParseFormat);
import Swal from "sweetalert2";
const MySwal = withReactContent(Swal);

export const getCurrentUsers = () => {
  const user = JSON.parse(sessionStorage.getItem(currentusers));

  return user;
};

export const getCurrentUserDetails = async () => {
  const userdet = getCurrentUsers();
  const api = `${apiUrl}/GetUserMasterDetails/1?UserId=${userdet?.userId}`;
  try {
    const resp = await fetch(api);
    const json = await resp.json();
    if (!json.status == 1) throw new Error(await json.msg);
  } catch (err) {
    console.log(err);
  }
};

export const logout = () => {
  sessionStorage.clear();
  // window.location.reload();
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

//Searching Input Box In Table
export const searchingdata = (value, data) => {
  console.log("value", value);
  console.log("data", data);

  const filteredData = data?.filter((o) =>
    Object.keys(o).some((k) =>
      String(o[k]).toLowerCase().includes(value.toLowerCase())
    )
  );
  return filteredData;
};

// const transformJSX = (jsx) => {
//   const code = Babel.transform(jsx, {
//     presets: ["react"],
//   }).code;
//   return eval(code);
// };

// export const DynamicIcon = (jsxString) => {
//   const iconElement = transformJSX(jsxString);

//   return iconElement;
// };
