import { useEffect, useState, useContext } from "react";
import { Loader2, PlusSquare } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";

import type { TrackPengiriman, Notify } from "@/types";
import { UserContext } from "@/App";
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
import ServiceTrackPengiriman from "@/actions/track-pengiriman";
import { Calendar } from "../ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";

export default function TrackPengiriman({
  idPengiriman,
  setRefresh,
  setNotify,
}: {
  idPengiriman: string;
  setRefresh: (refresh: boolean) => void;
  setNotify: (notify: Notify) => void;
}) {
  const {
    userAuth: { accessToken },
  } = useContext(UserContext);
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
    // getValues,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<TrackPengiriman>();

  const onSubmit: SubmitHandler<TrackPengiriman> = async (data) => {
    if (idPengiriman && accessToken) {
      try {
        setLoading(true)
        await ServiceTrackPengiriman.createDataTrackPengiriman(
          data,
          accessToken
        );
        setNotify({
          type: "success",
          message: `Track Pengiriman berhasil ditambahkan`,
        });
      } catch (error) {
        setNotify({
          type: "error",
          message: `Track Pengiriman gagal ditambahkan`,
        });
      } finally {
        setLoading(false);
        reset({
          pengiriman: {
            id: idPengiriman,
          },
          keterangan: "",
          tanggal_sampai: new Date(),
          gudang: {
            id: "",
          },
        });
        setOpen(false);
        setRefresh(true);
      }
    }
  };

  useEffect(() => {
    setValue("gudang.id", idGudang);
    clearErrors("gudang.id");
  }, [idGudang, setValue, clearErrors]);

  useEffect(() => {
    setValue("pengiriman.id", idPengiriman);
  }, [idPengiriman, setValue]);

  useEffect(() => {
    if (tanggalSampai) {
      setValue("tanggal_sampai", tanggalSampai);
    }
  }, [tanggalSampai, setValue]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          size="lg"
          className="text-lg mt-4 float-right"
        >
          <PlusSquare className="w-6 h-6 me-4" /> Tambah Track Pengiriman
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambahkan Track Pengiriman</DialogTitle>
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
            <ComboGudang idGudangData={idGudang} setIdGudang={setIdGudang} />
            {errors.gudang?.id && (
              <small className="block text-red-500 text-sm mt-2 ms-1">
                {errors.gudang.id.message}
              </small>
            )}
          </div>
          <div>
            <Label> Pilih tanggal sampai </Label>
            <input
              type="hidden"
              {...register("tanggal_sampai", {
                required: "Pilih tanggal sampai",
              })}
            />
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

          <div>
            <Textarea placeholder="Keterangan" {...register("keterangan")} />
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
