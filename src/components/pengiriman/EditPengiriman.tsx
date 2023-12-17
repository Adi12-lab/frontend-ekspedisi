import { useState, useEffect, useContext } from "react";
import { Loader2 } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { UserContext } from "@/App";

import { storage } from "@/lib/firebase";
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
import { Textarea } from "@/components/ui/textarea";
import ServicePengiriman from "@/actions/pengiriman";
import SelectStatus from "./SelectStatus";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateString } from "@/lib/utils";

export default function EditPengiriman({
  data,
  open,
  setOpen,
  setRefresh,
  setNotify,
}: {
  data: Pengiriman;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefresh: (refresh: boolean) => void;
  setNotify: (notify: Notify) => void;
}) {
  const {
    userAuth: { accessToken },
  } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | string>();
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      setImage(files[0]);
    }
  };

  const onSubmit: SubmitHandler<Pengiriman> = async (data) => {
    if (data.id) {
      try {
        if (typeof image !== "string" && image) {
          if (image) {
            const imageRef = ref(
              storage,
              `${import.meta.env.VITE_FOLDER_IMAGE}/${generateString(8)}.jpg`
            );
            await uploadBytes(imageRef, image);
            data.bukti_pengiriman = imageRef.fullPath;
          }
        }
        const result = await ServicePengiriman.updateDataPengiriman(
          data.id,
          data,
          accessToken
        );
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
    const fetchImage = async (imageData: string) => {
      const imageUrl = await getDownloadURL(ref(storage, imageData));
      setImage(imageUrl);
    };
    if (data) {
      setValue("id", data.id)
      setValue("resi", data.resi);
      setValue("berat", data.berat);
      setValue("biaya", data.biaya);
      setValue("bukti_pengiriman", data.bukti_pengiriman);
      setValue("pesan", data.pesan);
      setValue("kuantitas", data.kuantitas);
      setValue("nama_barang", data.nama_barang);
      setValue("status", data.status);
      setStatus(data.status);
      setValue("pengirim.id", data.pengirim.id);
      setValue("alamat_penerima", data.alamat_penerima);
      if (data.bukti_pengiriman) fetchImage(data.bukti_pengiriman);
    }
  }, [data, setValue]);

  useEffect(() => {
    if (status) {
      setValue("status", status);
      clearErrors("status");
    }
  }, [status, setValue, clearErrors]);


  useEffect(() => {
    if (!status && isSubmitting) {
      setError("status", {
        message: "Status pengiriman diperlukan",
      });
    }
  }, [isSubmitting, status, setError]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen((state) => !state);
        setImage(undefined);
      }}
    >
      <DialogContent className="h-[650px] pt-9">
        <DialogHeader>
          <DialogTitle>Edit Pengiriman</DialogTitle>
        </DialogHeader>
        <ScrollArea>
          <form
            className="flex flex-col gap-y-5 mt-2 ml-2 mr-5"
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
                placeholder="Alamat penerima"
                {...register("alamat_penerima")}
              ></Textarea>
              {errors.alamat_penerima && (
                <small className="block text-red-500 text-sm mt-2 ms-1">
                  {errors.alamat_penerima.message}
                </small>
              )}
            </div>

            <div>
              <SelectStatus status={status} setStatus={setStatus} />
              {errors.status && (
                <small className="block text-red-500 text-sm mt-2 ms-1">
                  {errors.status.message}
                </small>
              )}
            </div>
            <div>
              {image ? (
                <img
                  src={
                    //jika upload gambar baru
                    typeof image !== "string"
                      ? URL.createObjectURL(image)
                      : image
                  }
                  width={200}
                  height={200}
                />
              ) : (
                <div className="w-[200px] h-[200px] bg-slate-400"></div>
              )}
              <Input
                type="file"
                name="gambar"
                placeholder="pilih gambar"
                onChange={handleImageChange}
              />
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
