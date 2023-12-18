import { useEffect, useState, useContext } from "react";
import { Loader2 } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { id } from "date-fns/locale";
import { parseISO } from "date-fns";

import { UserContext } from "@/App";

import type { TrackPengiriman, Notify } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ComboGudang } from "@/components/gudang/ComboGudang";
import ServiceTrackPengiriman from "@/actions/track-pengiriman";
import { Calendar } from "../ui/calendar";
import { Label } from "@/components/ui/label";
import format from "date-fns/format";
import { Textarea } from "../ui/textarea";

export default function EditDetailPengiriman({
  open,
  data,
  idPengiriman, //dibutuhkan, karena setiap detail pengiriman memiliki idPengiriman
  setRefresh,
  setNotify,
  setOpen,
}: {
  open: boolean;
  data: TrackPengiriman;
  idPengiriman: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefresh: (refresh: boolean) => void;
  setNotify: (notify: Notify) => void;
}) {
  const {
    userAuth: { accessToken },
  } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [tanggalSampai, setTanggalSampai] = useState<Date | undefined>(
    new Date()
  );
  const [activeMonth, setActiveMonth] = useState<Date>();
  const [idGudang, setIdGudang] = useState("");
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TrackPengiriman>({
    defaultValues: {
      pengiriman: {
        id: idPengiriman,
      },
    },
  });

  const onSubmit: SubmitHandler<TrackPengiriman> = async (data) => {
    if(accessToken) {
      try {
        setLoading(true);
        data.tanggal_sampai = format(new Date(data.tanggal_sampai), "y-MM-dd");
        await ServiceTrackPengiriman.updateDataTrackPengiriman(data.id, data, accessToken);
        setNotify({
          type: "success",
          message: `Track pengiriman berhasil diupdate`,
        });
      } catch (error) {
        setNotify({
          type: "error",
          message: `Track pengiriman gagal diupdate`,
        });
      } finally {
        setLoading(false);
        reset();
        setOpen(false);
        setRefresh(true);
      }
    }
  };

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      if (data.gudang.id) {
        setValue("gudang.id", data.gudang.id);
        setIdGudang(data.gudang.id);
      }
      if (data.pengiriman?.id) {
        setValue("pengiriman.id", data.pengiriman.id);
      }
      const parsedDate = parseISO(data.tanggal_sampai.toString());

      setValue("tanggal_sampai", parsedDate);
      setTanggalSampai(parsedDate);
      setActiveMonth(parsedDate);

      setValue("keterangan", data.keterangan);
    }
  }, [data, setValue]);

  useEffect(() => {
    if (idPengiriman) setValue("pengiriman.id", idPengiriman);
  }, [idPengiriman, setValue]);

  useEffect(() => {
    if (idGudang) {
      setValue("gudang.id", idGudang);
    }
  }, [idGudang, setValue]);

  useEffect(() => {
    if (tanggalSampai) {
      setValue("tanggal_sampai", tanggalSampai);
    }
  }, [tanggalSampai, setValue]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Track Pengiriman</DialogTitle>
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
            <Calendar
              mode="single"
              locale={id}
              selected={tanggalSampai}
              month={activeMonth}
              onMonthChange={setActiveMonth}
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
