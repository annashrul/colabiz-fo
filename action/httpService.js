import axios from "axios";
import Cookies from "js-cookie";
import { STRING_COOKIES } from "../redux/type";

const coo = Cookies.get(STRING_COOKIES.token);
if (coo !== undefined) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${atob(coo)}`;
}

export default {
  axios: axios,
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  noData: "https://www.napro.id/assets/images/placeholder-no-data.png",
  apiUrl: "https://api.kolabiz.id/",
  apiClient: "https://api.kolabiz.id/",
};
