import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import type { Pengirim, Notify } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import ServicePengirim from "../../actions/pengirim";

function EditPengirim({
  data,
  open,
  setOpen,
  setRefresh,
  setNotify,
}: {
  data: Pengirim;
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: (refresh: boolean) => void;
  setNotify: (notify: Notify) => void;
}) {
   
    
  const [form, setForm] = useState<Pengirim>({
    id: '',
    nama: '',
    email: '',
    telepon: '',
    alamat: '',
  });

  useEffect(()=> {
    if(data) {
      setForm(data)
    }
  } , [data])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target
    setForm({
      ...form,
      [name]: value
    })
   }

   const handleSubmit: React.FormEventHandler<HTMLFormElement> = async(e) => {
    e.preventDefault();
    if(form.id && form.nama && form.alamat) {
      const result = await ServicePengirim.updateDataPengirim(form.id, form)
      if(result.status === 200) {
        setNotify({
          type: 'success',
          message: `Pengirim ${result.data.nama} berhasil diupdate`
        })
      } else {
        setNotify({
          type: 'error',
          message: `Barang gagal diupdate`
        })
      }
    }
    setLoading(false)
    setOpen(false)
    setRefresh(true)
  };
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={()=> setOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pengirim</DialogTitle>
        </DialogHeader> 
        <form className="flex flex-col gap-y-5" onSubmit={handleSubmit}>
          <Input
            type="text"
            name="nama"
            placeholder="Nama Pengirim"
            onChange={handleChange}
            value={form.nama}
          />
           <Input
            type="text"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
          />
            <Input
            type="text"
            name="telepon"
            placeholder="Telepon"
            onChange={handleChange}
            value={form.telepon}
          />
          <Textarea
            name="alamat"
            placeholder="Alamat"
            onChange={handleChange}
            value={form.alamat}
          />

          <DialogFooter>
            {loading ? (
              <Button type="submit" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan
              </Button>
            ) : (
              <Button type="submit">Simpan</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditPengirim;
