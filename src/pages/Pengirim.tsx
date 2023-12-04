import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import ServicePengirim from "../actions/pengirim";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pengirim as PengirimType, Notify, SelectedPengirim } from "@/types";
import AddPengirim from "@/components/pengirim/AddPengirim";
import DeletePengirim from "@/components/pengirim/DeletePengirim";
import EditPengirim from "@/components/pengirim/EditPengirim";

const Pengirim = () => {
  const [pengirim, setPengirim] = useState<PengirimType[]>([]);
  const [refresh, setRefresh] = useState(true);
  const [open, setOpen] = useState(false);
  const [notify, setNotify] = useState<Notify>({
    type: null,
    message: "",
  });
  const [selected, setSelected] = useState<SelectedPengirim>({
    pengirim: undefined,
    operation: null,
  });
  useEffect(() => {
    const getPengirim = async () => {
      const result = await ServicePengirim.getDataPengirim();
      setPengirim(result.data);
    };

    if (refresh) {
      getPengirim();
      if (notify.type === "success" && refresh) {
        toast.success(notify.message);
      } else if (notify.type === "error") {
        toast.error(notify.message);
      }
      setRefresh(false);
    }
  }, [refresh, notify]);
  return (
    <section className="mt-5">
     
        <Toaster position="top-center" reverseOrder={false} />
        <div>
          <h1 className="font-bold text-3xl text-center">Daftar Pengirim</h1>
          <AddPengirim setRefresh={setRefresh} setNotify={setNotify}/>
        </div>

        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pengirim &&
              pengirim.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.nama}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.telepon}</TableCell>
                  <TableCell>{item.alamat}</TableCell>
                  <TableCell className="flex space-x-3">
                    <Button variant="warning"
                       onClick={() => {
                        setSelected({ pengirim: item, operation: "edit" })
                        setOpen(true)
                       }
                      }
                    >
                      <Pencil
                        className="w-4 h-4 me-3"
                      />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelected({ pengirim: item, operation: "delete" });
                        setOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 me-3" />
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      <EditPengirim
           open={selected.operation === "edit" && open}
           setOpen={setOpen}
           data={selected.pengirim as PengirimType}
           setRefresh={setRefresh}
           setNotify={setNotify}
      />
      <DeletePengirim
        open={selected.operation === "delete" && open}
        setOpen={setOpen}
        data={selected.pengirim as PengirimType}
        setRefresh={setRefresh}
        setNotify={setNotify}
      />
    </section>
  );
};

export default Pengirim;
