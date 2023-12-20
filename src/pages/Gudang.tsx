import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

import { UserContext } from "@/App";
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
import AnimationWrapper from "@/components/layout/page-animation";

const Gudang = () => {
  const {
    userAuth: { accessToken, roles },
  } = useContext(UserContext);
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
      if(accessToken) {
        const result = await ServiceGudang.getDataGudang(accessToken);
        setGudang(result.data);
      }
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
  }, [refresh, notify, accessToken]);
  return accessToken === null ? (
    <Navigate to="/login" />
  ) : (
    <AnimationWrapper
      keyValue="gudang"
      className="mt-5"
      transition={{ duration: 0.4 }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <div>
        <h1 className="font-bold text-3xl text-center">Daftar Gudang</h1>
        {roles && roles[0] === "ROLE_ADMIN" ? (<AddGudang setRefresh={setRefresh} setNotify={setNotify} />) : "" }
      </div>

      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Alamat</TableHead>
            {roles && roles[0] === "ROLE_ADMIN" ? <TableHead>Aksi</TableHead> : ""}
          </TableRow>
        </TableHeader>
        <TableBody>
          {gudang &&
            gudang.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium w-1/3">{item.id}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.alamat}</TableCell>
                {roles && roles[0] === "ROLE_ADMIN" ? (
                  <TableCell className="flex space-x-3">
                    <Button
                      variant="warning"
                      onClick={() => {
                        setSelected({ gudang: item, operation: "edit" });
                        setOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 me-3" />
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
                ) : (
                  ""
                )}
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
    </AnimationWrapper>
  );
};

export default Gudang;
