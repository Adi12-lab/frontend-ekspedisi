type Gudang = {
    id?: string,
    nama: string,
    alamat: string
}

type Notify = {
    type: null |'success' | 'error',
    message: string
}

type SelectedGudang = {
    gudang?: Gudang,
    operation?:'edit' | 'delete' | null
}
export type {Gudang, Notify, SelectedGudang}