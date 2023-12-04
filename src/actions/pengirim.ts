import axios from "axios";
import type { Pengirim } from "@/types";
const BASE_URL = 'http://localhost:8080/pengirim';

class ServicePengirim {
    getDataPengirim() {
        return axios.get(`${BASE_URL}/all`)
    }
    createDataPengirim(data: Pengirim) {
        return axios.post(`${BASE_URL}/create`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    updateDataPengirim(id: string,data: Pengirim) {
        return axios.put(`${BASE_URL}/update/${id}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    deleteDataPengirim(id: string) {
        return axios.delete(`${BASE_URL}/delete/${id}`)
    }
}

export default new ServicePengirim()