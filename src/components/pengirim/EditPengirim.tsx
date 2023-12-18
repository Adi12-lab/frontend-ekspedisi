import { useEffect, useState, useContext } from "react";
import { Loader2 } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

import { UserContext } from "@/App";

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
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefresh: (refresh: boolean) => void;
  setNotify: (notify: Notify) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<Pengirim>();
  const {
    userAuth: { accessToken },
  } = useContext(UserContext);

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("nama", data.nama);
      setValue("alamat", data.alamat);
      setValue("email", data.email);
      setValue("telepon", data.telepon);
    }
  }, [data, setValue]);

  const onSubmit: SubmitHandler<Pengirim> = async (data) => {
    if (data.id && accessToken) {
      try {
        setLoading(true)
        const result = await ServicePengirim.updateDataPengirim(data.id, data, accessToken);
        setNotify({
          type: "success",
          message: `Pengirim ${result.data.nama} berhasil diupdate`,
        });
      } catch (err) {
        setNotify({
          type: "error",
          message: `Barang gagal diupdate`,
        });
      } finally {
        setLoading(false);
        reset()
        setOpen(false);
        setRefresh(true);
      }
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pengirim</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Input
              type="text"
              placeholder="Nama Pengirim"
              {...register("nama", { required: "Nama diperlukan" })}
            />
            {errors.nama && (
              <small className="block text-red-500 text-sm mt-2 ms-1">
                {errors.nama.message}
              </small>
            )}
          </div>
          <div>
            <Input
              type="text"
              placeholder="Email"
              {...register("email", { required: "Email diperlukan" })}
            />
            {errors.email && (
              <small className="block text-red-500 text-sm mt-2 ms-1">
                {errors.email.message}
              </small>
            )}
          </div>
          <div>
            <Input
              type="text"
              placeholder="Telepon"
              {...register("telepon", { required: "No telepon diperlukan" })}
            />
            {errors.telepon && (
              <small className="block text-red-500 text-sm mt-2 ms-1">
                {errors.telepon.message}
              </small>
            )}
          </div>
          <div>
          <Textarea
            placeholder="Alamat"
            {...register("alamat", { required: "Alamat diperlukan", minLength: {value: 5, message: "Alamat terlalu pendek"}})}
          />
          {errors.alamat && (
              <small className="block text-red-500 text-sm mt-2 ms-1">
                {errors.alamat.message}
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

export default EditPengirim;
