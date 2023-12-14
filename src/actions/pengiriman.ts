import axios from "axios";
import type { Pengiriman } from "@/types";
const BASE_URL = 'http://localhost:8080/pengiriman';

class ServicePengiriman {
    getDataPengiriman() {
        return axios.get(`${BASE_URL}/all`)
    }
    createDataPengiriman(data: Pengiriman) {
        return axios.post(`${BASE_URL}/create`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    updateDataPengiriman(resi: string,data: Pengiriman) {
        return axios.put(`${BASE_URL}/update/${resi}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    deleteDataPengiriman(resi: string) {
        return axios.delete(`${BASE_URL}/delete/${resi}`)
    }
}

export default new ServicePengiriman()