import { useState, useContext } from "react";
import { Loader2, PlusSquare } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

import { UserContext } from "@/App";

import type { Pengirim, Notify } from "@/types";
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
import ServicePengirim from "../../actions/pengirim";

export default function AddPengirim({
  setRefresh,
  setNotify,
}: {
  setRefresh: (refresh: boolean) => void;
  setNotify: (notify: Notify) => void;
}) {
  const {
    userAuth: { accessToken },
  } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Pengirim>();

  const onSubmit: SubmitHandler<Pengirim> = async (data) => {
    try {
      const result = await ServicePengirim.createDataPengirim(data, accessToken);
      setNotify({
        type: "success",
        message: `Pengirim ${result.data.nama} berhasil ditambahkan`,
      });
    } catch (error) {
      setNotify({
        type: "error",
        message: `Pengirim gagal ditambahkan`,
      });
    } finally {
      setLoading(false);
      setOpen(false);
      reset()
      setRefresh(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={()=> {
      setOpen(state => !state)
      reset()
    }}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} size="lg" className="float-right text-lg">
          <PlusSquare className="w-6 h-6 me-4" /> Tambah Pengirim
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambahkan Pengirim</DialogTitle>
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
