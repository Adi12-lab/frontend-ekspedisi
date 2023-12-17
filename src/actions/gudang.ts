import axios from "axios";
import type { Gudang } from "@/types";
const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/gudang`;

class ServiceGudang {
    getDataGudang(accessToken: string) {
        return axios.get(`${BASE_URL}/all`, {headers: {
            "Content-Type": "application/json",
            "Authorization": accessToken    
        }})
    }
    createDataGudang(data: Gudang, accessToken: string) {
        return axios.post(`${BASE_URL}/create`, data, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": accessToken
            }
        });
    }
    updateDataGudang(id: string,data: Gudang, accessToken: string ) {
        return axios.put(`${BASE_URL}/update/${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": accessToken
            }
        });
    }
    deleteDataGudang(id: string, accessToken: string) {
        return axios.delete(`${BASE_URL}/delete/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken
            }
        })
    }
}

export default new ServiceGudang()