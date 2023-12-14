import axios from "axios";
import type { DetailPengiriman } from "@/types";
const BASE_URL = 'http://localhost:8080/detail-pengiriman';

class ServiceDetailPengiriman {
    getDataDetailPengiriman(resi: string) {
        return axios.get(`${BASE_URL}/all/${resi}`)
    }
    createDataDetailPengiriman(data: DetailPengiriman) {
        return axios.post(`${BASE_URL}/create`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    updateDataDetailPengiriman(id: string,data: DetailPengiriman) {
        return axios.put(`${BASE_URL}/update/${id}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    deleteDataDetailPengiriman(id: string) {
        return axios.delete(`${BASE_URL}/delete/${id}`)
    }
}

export default new ServiceDetailPengiriman()