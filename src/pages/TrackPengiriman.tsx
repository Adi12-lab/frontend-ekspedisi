import { useState, useEffect, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Navigate, useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import {
  TrackPengiriman as TrackPengirimanType,
  Notify,
  SelectedTrackPengiriman,
  Pengiriman,
} from "@/types";
import ServiceTrackPengiriman from "@/actions/track-pengiriman";
import ServicePengiriman from "@/actions/pengiriman";
import { UserContext } from "@/App";

import {formatDate} from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddTrackPengiriman from "@/components/track-pengiriman/AddTrackPengiriman";
import EditTrackPengiriman from "@/components/track-pengiriman/EditTrackPengiriman";
import DeleteTrackPengiriman from "@/components/track-pengiriman/DeleteTrackPengiriman";
import AnimationWrapper from "@/components/layout/page-animation";

const TrackPengiriman = () => {
  const {
    userAuth: { accessToken },
  } = useContext(UserContext);
  const { resi } = useParams();
  const [trackPengiriman, setTrackPengiriman] = useState<TrackPengirimanType[]>(
    []
  );
  const [pengiriman, setPengiriman] = useState<Pengiriman>();
  const [refresh, setRefresh] = useState(true);
  const [open, setOpen] = useState(false);
  const [notify, setNotify] = useState<Notify>({
    type: null,
    message: "",
  });
  const [selected, setSelected] = useState<SelectedTrackPengiriman>({
    trackPengiriman: undefined,
    operation: null,
  });

  useEffect(() => {
    const getDetailPengiriman = async () => {
      if (resi) {
        const result =
          await ServiceTrackPengiriman.getDataTrackPengirimanByResi(
            resi,
            accessToken
          );
        setTrackPengiriman(result.data);
        const resultPengiriman =
          await ServicePengiriman.findDataPengirimanByResi(resi, accessToken);
        setPengiriman(resultPengiriman.data);
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
  }, [refresh, notify, resi, accessToken]);
  return accessToken === null ? (<Navigate to={"/"} />) : 
    (<AnimationWrapper keyValue={"track-pengiriman"}>
      <Toaster position="top-center" reverseOrder={false} />
      <div>
        <h1 className="font-bold text-2xl">
          Track Pengiriman {resi as string}
        </h1>
        <AddTrackPengiriman
          setRefresh={setRefresh}
          setNotify={setNotify}
          idPengiriman={pengiriman?.id as string}
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
          {trackPengiriman &&
            trackPengiriman.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.gudang.nama}</TableCell>
                <TableCell>{formatDate(item.tanggal_sampai.toString())}</TableCell>
                <TableCell width="50%">
                  <p>{item.keterangan || "-"}</p>
                </TableCell>
                <TableCell className="flex space-x-3">
                  <Button
                    variant="warning"
                    onClick={() => {
                      setSelected({
                        trackPengiriman: item,
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
                        trackPengiriman: item,
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
      <EditTrackPengiriman
        open={selected.operation === "edit" && open}
        idPengiriman={pengiriman?.id as string}
        setOpen={setOpen}
        data={selected.trackPengiriman as TrackPengirimanType}
        setRefresh={setRefresh}
        setNotify={setNotify}
      />
      <DeleteTrackPengiriman
        open={selected.operation === "delete" && open}
        setOpen={setOpen}
        data={selected.trackPengiriman as TrackPengirimanType}
        setRefresh={setRefresh}
        setNotify={setNotify}
      />
    </AnimationWrapper>
  );
};

export default TrackPengiriman;
