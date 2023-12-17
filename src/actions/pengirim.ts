import axios from "axios";
import type { Pengirim } from "@/types";
const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/pengirim`;

class ServicePengirim {
    getDataPengirim(accessToken: string) {
        return axios.get(`${BASE_URL}/all`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken
            }
        })
    }
    createDataPengirim(data: Pengirim, accessToken: string) {
        return axios.post(`${BASE_URL}/create`, data, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": accessToken
            }
        });
    }
    updateDataPengirim(id: string,data: Pengirim, accessToken: string) {
        return axios.put(`${BASE_URL}/update/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": accessToken,
            }
        });
    }
    deleteDataPengirim(id: string, accessToken: string) {
        return axios.delete(`${BASE_URL}/delete/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken
            }
        })
    }
}

export default new ServicePengirim()