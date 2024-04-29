import { currentusers, dateFormat } from "../../json/api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const getCurrentUsersDetails = () => {
  const user = JSON.parse(sessionStorage.getItem(currentusers));
  //   console.log("user", user);
  if (user) {
    return user;
  }
};

export const getCurrentDate = () => {
  return dayjs().format(dateFormat);
};

