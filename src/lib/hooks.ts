import { create } from 'zustand'
import { Pengirim, Pengiriman, DetailPengiriman, Gudang, Notify } from '@/types'



interface modalStore {
    modalType: 'add' | 'edit' | 'delete' | null
    isOpen: boolean
    data: Pengirim | Pengiriman | DetailPengiriman | Gudang | null
    isNotify: Notify | null
    refresh: boolean
    setModalType: (modaltype: 'add' | 'edit' | 'delete' | null) => void
    setIsOpen: (isOpen: boolean) => void
    setData: (data: Pengirim | Pengiriman | DetailPengiriman | Gudang | null) => void
    setNotify: (isNotify: Notify | null) => void
    setRefresh: (refresh: boolean) => void
}

export const useModalStore = create<modalStore>()(
    (set) => ({
        modalType: null,
        isOpen: false,
        data: null,
        isNotify: null,
        refresh: true,
        setIsOpen: (isOpen) => set(() => ({ isOpen })),
        setModalType: (modalType) => set(() => ({ modalType })),
        setData: (data) => set(() => ({data})),
        setNotify: (isNotify) => set(() => ({isNotify})),
        setRefresh: (refresh) => set(() => ({refresh}))
    })
)




