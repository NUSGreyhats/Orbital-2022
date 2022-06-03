import Cookies from "js-cookie";
import { logout } from "../api/api";
import { TailSpin } from "react-loading-icons";

export default function Logout() {
  logout();
  Cookies.remove("username");
  window.location.href = "/";
  return <TailSpin />;
}
