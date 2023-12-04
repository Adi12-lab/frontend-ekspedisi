type Gudang = {
    id?: string,
    nama: string,
    alamat: string
}
type SelectedGudang = {
    gudang?: Gudang,
    operation?:'edit' | 'delete' | null
}

type Notify = {
    type: null |'success' | 'error',
    message: string
}
type Pengirim = {
    id?: string,
    nama: string,
    email: string,
    telepon: string,
    alamat: string
}

type SelectedPengirim = {
    pengirim?: Pengirim,
    operation?:'edit' | 'delete' | null
}

type Pengiriman = {
    resi: string,
        
}

export type {
    Gudang, 
    SelectedGudang,
    Pengirim,
    SelectedPengirim,
    Notify, 
}