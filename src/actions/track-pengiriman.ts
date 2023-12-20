import axios from "axios";
import type { TrackPengiriman } from "@/types";
const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/track-pengiriman`;

class ServiceTrackPengiriman {
    getDataTrackPengirimanByPengirim(id: string, accessToken: string) {
        return axios.get(`${BASE_URL}/find-by-pengiriman/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken
            }
        })
    }
    createDataTrackPengiriman(data: TrackPengiriman, accessToken: string) {
        return axios.post(`${BASE_URL}/create`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken
            }
        });
    }
    updateDataTrackPengiriman(id: string,data: TrackPengiriman, accessToken: string) {
        return axios.put(`${BASE_URL}/update/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken
            }
        });
    }
    deleteDataTrackPengiriman(id: string, accessToken: string) {
        return axios.delete(`${BASE_URL}/delete/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": accessToken
            }
        })
    }
}

export default new ServiceTrackPengiriman()