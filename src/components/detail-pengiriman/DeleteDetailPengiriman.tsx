import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Notify, DetailPengiriman } from "@/types";
import { Button } from "@/components/ui/button";
import ServiceDetailPengiriman from "../../actions/detail-pengiriman";


function DeleteDetailPengiriman({ data ,open,setOpen, setRefresh, setNotify }: 
  { data: DetailPengiriman, 
    open: boolean ,
    setOpen: (open: boolean)=> void, 
    setRefresh: (refresh: boolean) => void,
    setNotify: (notify: Notify)=> void
  }) {
  const [loading, setLoading] = useState(false);


  const handleDelete = async(id: string) => {
    setLoading(true)
    try {
        await ServiceDetailPengiriman.deleteDataDetailPengiriman(id)
        setNotify({
          type: 'success',
          message: `Detail pengiriman berhasil dihapus`
        })
    } catch(error) {
        setNotify({
            type: 'error',
            message: `Detail pengiriman gagal dihapus`
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
            Hapus detail pengiriman ?
          </p>
        <AlertDialogFooter>
            <Button type="button" variant={"outline"} onClick={()=> setOpen(false)}>Batal</Button>
            {
              loading ?
              (<Button type="submit" variant={'destructive'} disabled><Loader2  className="mr-2 h-4 w-4 animate-spin" onClick={()=> setOpen(false)} /> Menghapus</Button>)
              :
              (<Button variant={'destructive'} onClick={()=> handleDelete(data.id as string)}>Hapus</Button>) 
            }  
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteDetailPengiriman;
