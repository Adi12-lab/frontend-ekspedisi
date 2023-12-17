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
import type { Gudang, Notify } from "@/types";
import { Button } from "@/components/ui/button";
import ServiceGudang from "../../actions/gudang";

function DeleteGudang({
  data,
  open,
  setOpen,
  setRefresh,
  setNotify,
}: {
  data: Gudang;
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
    try {
      setLoading(true);
      await ServiceGudang.deleteDataGudang(id, accessToken);
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
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Gudang</AlertDialogTitle>
        </AlertDialogHeader>
        <p>Hapus gudang {data && data.nama} ?</p>
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

export default DeleteGudang;
