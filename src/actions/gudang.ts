import axios from "axios";
import type { Gudang } from "@/types";
const BASE_URL = 'http://localhost:8080/gudang';

class ServiceGudang {
    getDataGudang() {
        return axios.get(`${BASE_URL}/all`)
    }
    createDataGudang(data: Gudang) {
        return axios.post(`${BASE_URL}/create`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    updateDataGudang(id: string,data: Gudang) {
        return axios.put(`${BASE_URL}/update/${id}`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    deleteDataGudang(id: string) {
        return axios.delete(`${BASE_URL}/delete/${id}`)
    }
}

export default new ServiceGudang()