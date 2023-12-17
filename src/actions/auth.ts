import { Payload } from "@/types";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/auth`;

class ServiceAuth{
    login(payload: Payload) {
        return axios.post(`${BASE_URL}/login`, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    register(payload: Payload) {
        return axios.post(`${BASE_URL}/register`, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    
}
export default new ServiceAuth()