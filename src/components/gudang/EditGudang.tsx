import { useEffect, useState, useContext } from "react";
import { Loader2 } from "lucide-react";

import { UserContext } from "@/App";

import type { Gudang, Notify } from "@/types";
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

import ServiceGudang from "../../actions/gudang";

function EditGudang({
  data,
  open,
  setOpen,
  setRefresh,
  setNotify,
}: {
  data: Gudang;
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: (refresh: boolean) => void;
  setNotify: (notify: Notify) => void;
}) {
  const {
    userAuth: { accessToken},
  } = useContext(UserContext);
  const [form, setForm] = useState<Gudang>({
    id: "",
    nama: "",
    alamat: "",
  });

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (form.id && form.nama && form.alamat && accessToken) {
      try {
        setLoading(true)
        const result = await ServiceGudang.updateDataGudang(form.id, form, accessToken);
        setNotify({
          type: "success",
          message: `Gudang ${result.data.nama} berhasil diupdate`,
        });
      } catch (error) {
        setNotify({
          type: "error",
          message: `Barang gagal diupdate`,
        });
      } finally {
        setLoading(false);
        setOpen(false);
        setRefresh(true);
      }
    }
  };
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Gudang</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-y-5" onSubmit={handleSubmit}>
          <Input
            type="text"
            name="nama"
            placeholder="Nama Gudang"
            onChange={handleChange}
            value={form.nama}
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

export default EditGudang;
