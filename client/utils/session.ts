import {jwtDecode} from 'jwt-decode';
import { toast } from "react-toastify";

interface decodedToken{
    exp: number;
    [key: number] :unknown;
}

export const checkSessionAndLogout = (): void =>{
    const token = localStorage.getItem('authToken');

    if(!token){
        logoutUser()
        return;
    }

    try {
        const decoded: decodedToken = jwtDecode(token);
        const currentTimeInSeconds = Date.now() / 1000;
        if(decoded.exp < currentTimeInSeconds){
            logoutUser()

        }
    } catch (error) {
        console.error('Invalid token:', error);
        logoutUser()
    }
}



function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
    return null;
  }


  function logoutUser(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
    toast.error('Session expired. Please login again.');
    window.location.href = '/login';
  }
  