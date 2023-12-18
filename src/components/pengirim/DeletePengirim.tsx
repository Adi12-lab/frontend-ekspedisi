import { useState, useContext } from "react";
import { Loader2 } from "lucide-react";

import { UserContext } from "@/App";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Pengirim, Notify } from "@/types";
import { Button } from "@/components/ui/button";
import ServicePengirim from "../../actions/pengirim";

function DeletePengirim({
  data,
  open,
  setOpen,
  setRefresh,
  setNotify,
}: {
  data: Pengirim;
  open: boolean;
  setOpen: (open: boolean) => void;
  setRefresh: (refresh: boolean) => void;
  setNotify: (notify: Notify) => void;
}) {
  const {
    userAuth: { accessToken },
  } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if(accessToken) {
      try {
        setLoading(true);
        await ServicePengirim.deleteDataPengirim(id, accessToken);
        setNotify({
          type: "success",
          message: `${data.nama} berhasil dihapus`,
        });
      } catch (error) {
        setNotify({
          type: "error",
          message: `${data.nama} gagal dihapus`,
        });
      } finally {
        setOpen(false);
        setLoading(false);
        setRefresh(true);
      }
    }
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Pengirim</AlertDialogTitle>
        </AlertDialogHeader>
        <p>Hapus Pengirim {data && data.nama} ?</p>
        <AlertDialogFooter>
          <Button
            type="button"
            variant={"outline"}
            onClick={() => setOpen(false)}
          >
            Batal
          </Button>
          {loading ? (
            <Button type="submit" variant={"destructive"} disabled>
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                onClick={() => setOpen(false)}
              />{" "}
              Menghapus
            </Button>
          ) : (
            <Button
              variant={"destructive"}
              onClick={() => handleDelete(data.id as string)}
            >
              Hapus
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeletePengirim;
