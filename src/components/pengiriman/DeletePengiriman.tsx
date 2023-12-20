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
import type { Pengiriman, Notify } from "@/types";
import { Button } from "@/components/ui/button";
import ServicePengiriman from "../../actions/pengiriman";

function DeletePengiriman({
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
  const {
    userAuth: { accessToken },
  } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if(accessToken) {
      try {
        setLoading(true);
        await ServicePengiriman.deleteDataPengiriman(id, accessToken);
        setNotify({
          type: "success",
          message: `Pengiriman ${data.nama_barang} berhasil dihapus`,
        });
      } catch (error) {
        setNotify({
          type: "error",
          message: `Pengiriman ${data.nama_barang} gagal dihapus`,
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
          <AlertDialogTitle>Hapus Pengiriman</AlertDialogTitle>
        </AlertDialogHeader>
        <p>Hapus Pengiriman {data && data.nama_barang} ?</p>
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

export default DeletePengiriman;
