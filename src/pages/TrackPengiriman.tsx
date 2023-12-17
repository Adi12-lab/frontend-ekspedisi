import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import { DetailPengiriman, Notify, SelectedDetailPengiriman } from "@/types";
import ServiceDetailPengiriman from "@/actions/detail-pengiriman";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddDetailPengiriman from "@/components/detail-pengiriman/AddDetailPengiriman";
import EditDetailPengiriman from "@/components/detail-pengiriman/EditDetailPengiriman";
import DeleteDetailPengiriman from "@/components/detail-pengiriman/DeleteDetailPengiriman";

const TrackPengiriman = () => {
  const { resi } = useParams();
  const [detailPengiriman, setDetailPengiriman] = useState<DetailPengiriman[]>(
    []
  );
  const [refresh, setRefresh] = useState(true);
  const [open, setOpen] = useState(false);
  const [notify, setNotify] = useState<Notify>({
    type: null,
    message: "",
  });
  const [selected, setSelected] = useState<SelectedDetailPengiriman>({
    detailPengiriman: undefined,
    operation: null,
  });

  useEffect(() => {
    const getDetailPengiriman = async () => {
      if (resi) {
        const result = await ServiceDetailPengiriman.getDataDetailPengiriman(
          resi
        );
        setDetailPengiriman(result.data);
      }
    };

    if (refresh) {
      getDetailPengiriman();
      if (notify.type === "success" && refresh) {
        toast.success(notify.message);
      } else if (notify.type === "error") {
        toast.error(notify.message);
      }
      setRefresh(false);
    }
  }, [refresh, notify, resi]);
  return (
    <section className="mt-5">
      <Toaster position="top-center" reverseOrder={false} />
      <div>
        <h1 className="font-bold text-2xl">
          Track Pengiriman {resi as string}
        </h1>
        <AddDetailPengiriman
          setRefresh={setRefresh}
          setNotify={setNotify}
          resi={resi as string}
        />
      </div>

      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>Gudang</TableHead>
            <TableHead>Tanggal Sampai</TableHead>
            <TableHead>Ketarangan</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {detailPengiriman &&
            detailPengiriman.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.gudang.nama}</TableCell>
                <TableCell>{item.tanggal_sampai.toString()}</TableCell>
                <TableCell width="50%">
                  <p>{item.keterangan || "-"}</p>
                </TableCell>
                <TableCell className="flex space-x-3">
                  <Button
                    variant="warning"
                    onClick={() => {
                      setSelected({
                        detailPengiriman: item,
                        operation: "edit",
                      });
                      setOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4 me-3" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelected({
                        detailPengiriman: item,
                        operation: "delete",
                      });
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
      <EditDetailPengiriman
        open={selected.operation === "edit" && open}
        resi={resi as string}
        setOpen={setOpen}
        data={selected.detailPengiriman as DetailPengiriman}
        setRefresh={setRefresh}
        setNotify={setNotify}
      />
      <DeleteDetailPengiriman
        open={selected.operation === "delete" && open}
        setOpen={setOpen}
        data={selected.detailPengiriman as DetailPengiriman}
        setRefresh={setRefresh}
        setNotify={setNotify}
      />
    </section>
  );
};

export default TrackPengiriman;
