import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import ServiceGudang from "../actions/gudang";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Gudang as GudangType, Notify, SelectedGudang } from "@/types";
import AddGudang from "@/components/gudang/AddGudang";
import DeleteGudang from "@/components/gudang/DeleteGudang";
import EditGudang from "@/components/gudang/EditGudang";
const Gudang = () => {
  const [gudang, setGudang] = useState<GudangType[]>([]);
  const [refresh, setRefresh] = useState(true);
  const [open, setOpen] = useState(false);
  const [notify, setNotify] = useState<Notify>({
    type: null,
    message: "",
  });
  const [selected, setSelected] = useState<SelectedGudang>({
    gudang: undefined,
    operation: null,
  });
  useEffect(() => {
    const getGudang = async () => {
      const result = await ServiceGudang.getDataGudang();
      setGudang(result.data);
    };

    if (refresh) {
      getGudang();
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
          <h1 className="font-bold text-3xl text-center">Daftar Gudang</h1>
          <AddGudang setRefresh={setRefresh} setNotify={setNotify}/>
        </div>

        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gudang &&
              gudang.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium w-1/3">{item.id}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.alamat}</TableCell>
                  <TableCell className="flex space-x-3">
                    <Button variant="warning"
                       onClick={() => {
                        setSelected({ gudang: item, operation: "edit" })
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
                        setSelected({ gudang: item, operation: "delete" });
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
      <EditGudang
           open={selected.operation === "edit" && open}
           setOpen={setOpen}
           data={selected.gudang as GudangType}
           setRefresh={setRefresh}
           setNotify={setNotify}
      />
      <DeleteGudang
        open={selected.operation === "delete" && open}
        setOpen={setOpen}
        data={selected.gudang as GudangType}
        setRefresh={setRefresh}
        setNotify={setNotify}
      />
    </section>
  );
};

export default Gudang;
