import { useEffect, useState } from "react";
import { Loader2, PlusSquare } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";

import type { DetailPengiriman, Notify } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ComboGudang } from "@/components/gudang/ComboGudang";
import ServiceDetailPengiriman from "@/actions/detail-pengiriman";
import { Calendar } from "../ui/calendar";
import { Label } from "@/components/ui/label";

export default function AddDetailPengiriman({
  resi,
  setRefresh,
  setNotify,
}: {
  resi: string,
  setRefresh: (refresh: boolean) => void,
  setNotify: (notify: Notify) => void
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [tanggalSampai, setTanggalSampai] = useState<Date | undefined>(
    new Date()
  );
  const [idGudang, setIdGudang] = useState("");
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    reset,
  } = useForm<DetailPengiriman>();

  const onSubmit: SubmitHandler<DetailPengiriman> = async (data) => {
    try {
      const result = await ServiceDetailPengiriman.createDataDetailPengiriman(
        data
      );
      setNotify({
        type: "success",
        message: `DetailPengiriman ${result.data.nama} berhasil ditambahkan`,
      });
    } catch (error) {
      setNotify({
        type: "error",
        message: `DetailPengiriman gagal ditambahkan`,
      });
    } finally {
      setLoading(false);
      reset()
      setOpen(false);
      setRefresh(true);
    }
  };

  useEffect(()=> {
    if(resi) setValue("pengiriman.resi", resi)
  }, [resi, setValue])

  useEffect(()=> {
    if(idGudang) {
      setValue("gudang.id", idGudang)
    }
  }, [idGudang, setValue])

  useEffect(()=> {
    if(tanggalSampai) {
      setValue("tanggal_sampai", tanggalSampai)
    }
  }, [tanggalSampai, setValue])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} size="lg" className="text-lg mt-4 float-right">
          <PlusSquare className="w-6 h-6 me-4" /> Tambah Detail Pengiriman
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambahkan DetailPengiriman</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <input
              type="hidden"
              {...register("gudang.id", { required: "Pilih gudang" })}
            />
            <ComboGudang setIdGudang={setIdGudang} />
            {errors.gudang?.id && (
              <small className="block text-red-500 text-sm mt-2 ms-1">
                {errors.gudang.id.message}
              </small>
            )}
          </div>
          <div>
          <Label> Pilih tanggal sampai  </Label>
            <input type="hidden" {...register("tanggal_sampai", {required: "Pilih tanggal sampai"})}/>
            <Calendar
              mode="single"
              selected={tanggalSampai}
              onSelect={setTanggalSampai}
            />
             {errors.tanggal_sampai && (
              <small className="block text-red-500 text-sm mt-2 ms-1">
                {errors.tanggal_sampai.message}
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
      </DialogContent>
    </Dialog>
  );
}
