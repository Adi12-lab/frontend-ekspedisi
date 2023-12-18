import { useState, useContext } from "react";
import { Loader2, PlusSquare } from "lucide-react";

import { UserContext } from "@/App";

import type { Gudang, Notify } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ServiceGudang from "../../actions/gudang";

export default function AddGudang({
  setRefresh,
  setNotify,
}: {
  setRefresh: (refresh: boolean) => void;
  setNotify: (notify: Notify) => void;
}) {
  const {
    userAuth: { accessToken},
  } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Gudang>({
    nama: "",
    alamat: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (form.nama && form.alamat && accessToken) {
      try {
        setLoading(true)
        const result = await ServiceGudang.createDataGudang(form, accessToken);
        setNotify({
          type: "success",
          message: `Gudang ${result.data.nama} berhasil ditambahkan`,
        });
      } catch (error) {
        setNotify({
          type: "error",
          message: `Barang gagal ditambahkan`,
        });
      } finally {
        setLoading(false);
        setOpen(false);
        setRefresh(true);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} size="lg" className="float-right text-lg">
          <PlusSquare className="w-6 h-6 me-4" /> Tambah Gudang
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambahkan Gudang</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-y-5" onSubmit={handleSubmit}>
          <Input
            type="text"
            name="nama"
            placeholder="Nama Gudang"
            onChange={handleChange}
          />
          <Textarea
            name="alamat"
            placeholder="Alamat"
            onChange={handleChange}
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
