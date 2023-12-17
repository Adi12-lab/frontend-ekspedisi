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

type StatusPengiriman = "TERKIRIM" | "DALAM_PENGIRIMAN" | "BELUM_DIANGKUT" | "DIBATALKAN";

type Pengiriman = {
    resi?: string,
    nama_barang: string,
    kuantitas: number,
    berat: number,
    biaya: number,
    status: StatusPengiriman,
    pesan?: string,
    alamat_penerima: string,
    bukti_pengiriman?: string
    pengirim: Pengirim
}

type SelectedPengiriman = {
    pengiriman?: Pengiriman,
    operation?:'edit' | 'delete' | null
}

type DetailPengiriman = {
    id: string,
    pengiriman?: Pengiriman,
    gudang: Gudang,
    tanggal_sampai: Date | string,
    keterangan?: string
}

type SelectedDetailPengiriman = {
    detailPengiriman?: DetailPengiriman,
    operation?:'edit' | 'delete' | null
}
export type {
    Gudang, 
    SelectedGudang,
    Pengirim,
    SelectedPengirim,
    Pengiriman,
    StatusPengiriman,
    SelectedPengiriman,
    Notify, 
    DetailPengiriman,
    SelectedDetailPengiriman
}