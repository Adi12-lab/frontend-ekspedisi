import axios from "axios";
import type { Pengiriman } from "@/types";
const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/pengiriman`;

class ServicePengiriman {
    getDataPengiriman(accessToken: string) {
        return axios.get(`${BASE_URL}/all`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken
            }
        })
    }
    findDataPengirimanByResi(resi: string, accessToken: string) {
        return axios.get(`${BASE_URL}/find-by-resi/${resi}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken
            }
        })
    }
    findDataPengirimanById(id: string, accessToken: string) {
        return axios.get(`${BASE_URL}/find-by-id/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken
            }
        })
    }
    createDataPengiriman(data: Pengiriman, accessToken: string) {
        return axios.post(`${BASE_URL}/create`, data, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": accessToken
            }
        });
    }

    updateDataPengiriman(id: string,data: Pengiriman, accessToken: string) {
        return axios.put(`${BASE_URL}/update/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": accessToken
            }
        });
    }
    deleteDataPengiriman(id: string, accessToken: string) {
        return axios.delete(`${BASE_URL}/delete/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": accessToken
            }})
    }
}

export default new ServicePengiriman()