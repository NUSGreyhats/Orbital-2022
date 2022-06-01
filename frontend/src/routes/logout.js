import Cookies from "js-cookie";
import { logout } from "../api/api";
import { TailSpin } from 'react-loading-icons';

export default function Logout() {
    logout().then(() => {
        window.location.href = "/";
        Cookies.remove("username");
    });
    return <TailSpin />
}