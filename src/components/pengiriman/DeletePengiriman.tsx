import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Pengiriman, Notify } from "@/types";
import { Button } from "@/components/ui/button";
import ServicePengiriman from "../../actions/pengiriman";


function DeletePengiriman({ data ,open,setOpen, setRefresh, setNotify }: 
  { data: Pengiriman, 
    open: boolean ,
    setOpen: (open: boolean)=> void, 
    setRefresh: (refresh: boolean) => void,
    setNotify: (notify: Notify)=> void
  }) {
  const [loading, setLoading] = useState(false);


  const handleDelete = async(resi: string) => {
    setLoading(true)
    try {
        await ServicePengiriman.deleteDataPengiriman(resi)
        setNotify({
          type: 'success',
          message: `Pengiriman ${data.nama_barang} erhasil dihapus`
        })
    } catch(error) {
        setNotify({
            type: 'error',
            message: `Pengiriman ${data.nama_barang} gagal dihapus`
          })
    }
    setOpen(false)
    setLoading(false)
    setRefresh(true)
  }
  
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengiriman</AlertDialogTitle>
        </AlertDialogHeader>
          <p>
            Hapus Pengiriman {data && data.nama_barang} ?
          </p>
        <AlertDialogFooter>
            <Button type="button" variant={"outline"} onClick={()=> setOpen(false)}>Batal</Button>
            {
              loading ?
              (<Button type="submit" variant={'destructive'} disabled><Loader2  className="mr-2 h-4 w-4 animate-spin" onClick={()=> setOpen(false)} /> Menghapus</Button>)
              :
              (<Button variant={'destructive'} onClick={()=> handleDelete(data.resi as string)}>Hapus</Button>) 
            }  
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeletePengiriman;
