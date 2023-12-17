import { useState, useEffect } from "react";
import { Loader2, PlusSquare } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";

import type { Pengiriman, Notify } from "@/types";
import ServicePengiriman from "@/actions/pengiriman";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ComboPengirim } from "../pengirim/ComboPengirim";
import { Textarea } from "@/components/ui/textarea";

export default function AddPengiriman({
  setRefresh,
  setNotify,
}: {
  setRefresh: (refresh: boolean) => void;
  setNotify: (notify: Notify) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [idPengirim, setIdPengirim] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<Pengiriman>();

  const onSubmit: SubmitHandler<Pengiriman> = async (data) => {
    data.status = "BELUM_DIANGKUT";
    try {
      const result = await ServicePengiriman.createDataPengiriman(data);
      setNotify({
        type: "success",
        message: `Pengiriman ${result.data.nama_barang} berhasil ditambahkan`,
      });
    } catch (error) {
      setNotify({
        type: "error",
        message: `Pengiriman gagal ditambahkan`,
      });
    } finally {
      setLoading(false);
      setOpen(false);
      reset();
      setRefresh(true);
    }
  };

  useEffect(() => {
    setValue("pengirim.id", idPengirim);
    clearErrors("pengirim.id");
  }, [idPengirim, setValue, clearErrors]);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} size="lg" className="text-lg mt-4">
          <PlusSquare className="w-6 h-6 me-4" /> Tambah Pengiriman
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[650px] pt-9">
        <ScrollArea>
          <DialogHeader className="mb-6">
            <DialogTitle>Tambahkan Pengiriman</DialogTitle>
          </DialogHeader>
          <form
            className="flex flex-col gap-y-5 ms-2 me-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <Input
                type="text"
                placeholder="Nama Barang"
                {...register("nama_barang", { required: "Berat diperlukan" })}
              />
              {errors.nama_barang && (
                <small className="block text-red-500 text-sm mt-2 ms-1">
                  {errors.nama_barang.message}
                </small>
              )}
            </div>
            <div>
              <Input
                type="number"
                placeholder="Berat"
                {...register("berat", { required: "Berat diperlukan" })}
              />
              {errors.berat && (
                <small className="block text-red-500 text-sm mt-2 ms-1">
                  {errors.berat.message}
                </small>
              )}
            </div>
            <div>
              <Input
                type="number"
                placeholder="Kuantitas"
                {...register("kuantitas", { required: "Kuantitas diperlukan" })}
              />
              {errors.kuantitas && (
                <small className="block text-red-500 text-sm mt-2 ms-1">
                  {errors.kuantitas.message}
                </small>
              )}
            </div>
            <div>
              <Input
                type="number"
                placeholder="Biaya Pengiriman"
                {...register("biaya", { required: "Biaya diperlukan" })}
              />
              {errors.biaya && (
                <small className="block text-red-500 text-sm mt-2 ms-1">
                  {errors.biaya.message}
                </small>
              )}
            </div>
            <div>
              <ComboPengirim
                idPengirimData={idPengirim}
                setIdPengirim={setIdPengirim}
              />
            </div>

            <div>
              <Textarea
                placeholder="Pesan pengirim"
                {...register("pesan")}
              ></Textarea>
              {errors.pesan && (
                <small className="block text-red-500 text-sm mt-2 ms-1">
                  {errors.pesan.message}
                </small>
              )}
            </div>

            <div>
              <Textarea
                placeholder="Alamat"
                {...register("alamat_penerima", {
                  required: "Alamat penerima diperlukan",
                })}
              ></Textarea>
              {errors.alamat_penerima && (
                <small className="block text-red-500 text-sm mt-2 ms-1">
                  {errors.alamat_penerima.message}
                </small>
              )}
            </div>

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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
