import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";

import { Pengiriman, Notify, StatusPengiriman } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ComboPengirim } from "../pengirim/ComboPengirim";
import { Textarea } from "@/components/ui/textarea";
import ServicePengiriman from "@/actions/pengiriman";
import SelectStatus from "./SelectStatus";

export default function EditPengiriman({
  data,
  open,
  setOpen,
  setRefresh,
  setNotify,
}: {
  data: Pengiriman;
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: (refresh: boolean) => void;
  setNotify: (notify: Notify) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [idPengirim, setIdPengirim] = useState("");
  const [status, setStatus] = useState<StatusPengiriman>("BELUM_DIANGKUT");
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Pengiriman>();

  const onSubmit: SubmitHandler<Pengiriman> = async (data) => {
    if(data.resi) {
      try {
        const result = await ServicePengiriman.updateDataPengiriman(data.resi,data);
        setNotify({
          type: "success",
          message: `Pengiriman ${result.data.nama_barang} berhasil diupdate`,
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
    }
  };

  useEffect(() => {
    if (data) {
      setValue("resi", data.resi)
      setValue("berat", data.berat);
      setValue("biaya", data.biaya);
      setValue("bukti_pengiriman", data.bukti_pengiriman);
      setValue("keterangan", data.keterangan);
      setValue("kuantitas", data.kuantitas);
      setValue("nama_barang", data.nama_barang);
      setValue("status", data.status);
      setValue("pengirim.id", data.pengirim.id);
      setValue("pengirim.alamat", data.pengirim.alamat);
      if (data.pengirim.id) setIdPengirim(data.pengirim.id);
    }
  }, [data, setValue]);

  useEffect(() => {
    setValue("pengirim.id", idPengirim);
    clearErrors("pengirim.id");
  }, [idPengirim, setValue, clearErrors]);

  useEffect(() => {
    if (status) {
      setValue("status", status);
      clearErrors("status");
    }
  }, [status, setError, setValue, clearErrors]);

  useEffect(()=> {
    if (!status && isSubmitting) {
      setError("status", {
        message: "Status pengiriman diperlukan",
      });
    }
  }, [isSubmitting, status, setError])
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pengiriman</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-y-5"
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
              placeholder="Keterangan"
              {...register("keterangan")}
            ></Textarea>
            {errors.keterangan && (
              <small className="block text-red-500 text-sm mt-2 ms-1">
                {errors.keterangan.message}
              </small>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Keterangan"
              {...register("pengirim.alamat")}
            ></Textarea>
            {errors.pengirim?.alamat && (
              <small className="block text-red-500 text-sm mt-2 ms-1">
                {errors.pengirim.alamat.message}
              </small>
            )}
          </div>

          <div>
            <SelectStatus
              status={status}
              setStatus={setStatus}
            />
            {errors.status && (
              <small className="block text-red-500 text-sm mt-2 ms-1">
                {errors.status.message}
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
