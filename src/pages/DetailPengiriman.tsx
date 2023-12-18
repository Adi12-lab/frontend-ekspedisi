import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getDownloadURL, ref } from "firebase/storage";

import { UserContext } from "@/App";
import { TrackPengiriman as TrackPengirimanType, Pengiriman } from "@/types";

import { storage } from "@/lib/firebase";
import { formatRupiah, formatDate } from "@/lib/utils";
import ServicePengiriman from "@/actions/pengiriman";
import ServiceTrackPengiriman from "@/actions/track-pengiriman";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { ImageWithSkeleton } from "@/components/ui/image-skeleton";
import { Separator } from "@/components/ui/separator";
import { BadgeStatusPengiriman } from "@/components/ui/badge-status-pengiriman";

const DetailPengiriman = () => {
  const { resi } = useParams();
  const {
    userAuth: { accessToken },
  } = useContext(UserContext);
  const [pengiriman, setPengiriman] = useState<Pengiriman>();
  const [trackPengiriman, setTrackPengiriman] = useState<TrackPengirimanType[]>(
    []
  );
  const [image, setImage] = useState<string>();

  useEffect(() => {
    const getPengirimanAndTrack = async () => {
      if (resi && accessToken) {
        const resultPengiriman =
          await ServicePengiriman.findDataPengirimanByResi(resi, accessToken);
        setPengiriman(resultPengiriman.data);
        const resultTrackPengiriman =
          await ServiceTrackPengiriman.getDataTrackPengirimanByResi(
            resi,
            accessToken
          );
        setTrackPengiriman(resultTrackPengiriman.data);
      }
    };

    getPengirimanAndTrack();
  }, [resi, accessToken]);

  useEffect(() => {
    const fetchImage = async (imageData: string) => {
      const imageUrl = await getDownloadURL(ref(storage, imageData));
      setImage(imageUrl);
    };
    if (pengiriman?.bukti_pengiriman) fetchImage(pengiriman.bukti_pengiriman);
  }, [pengiriman]);

  return (
    <section className="container">
      <h1 className="text-center font-bold text-3xl">Detail pengriman</h1>
      <div className="mt-7">
        <h2 className="font-semibold text-2xl">Rincian Pengiriman</h2>
        {pengiriman ? (
          <>
            <Table>
              <TableBody>
                <TableRow className="border-0">
                  <TableCell width="29%" className="pl-0">
                    Status
                  </TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>
                    <BadgeStatusPengiriman status={pengiriman.status} />
                  </TableCell>
                </TableRow>
                <TableRow className="border-0">
                  <TableCell width="29%" className="pl-0">
                    Nama Barang
                  </TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{pengiriman.nama_barang}</TableCell>
                </TableRow>
                <TableRow className="border-0">
                  <TableCell width="29%" className="pl-0">
                    Berat
                  </TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{pengiriman.berat} Kg</TableCell>
                </TableRow>
                <TableRow className="border-0">
                  <TableCell width="29%" className="pl-0">
                    Biaya
                  </TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{formatRupiah(pengiriman.biaya)} </TableCell>
                </TableRow>
                <TableRow className="border-0">
                  <TableCell width="29%" className="pl-0">
                    Pesan
                  </TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{pengiriman.pesan}</TableCell>
                </TableRow>
                <TableRow className="border-0">
                  <TableCell width="29%" className="pl-0">
                    Alamat penerima
                  </TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{pengiriman.alamat_penerima}</TableCell>
                </TableRow>
                <TableRow className="border-0">
                  <TableCell width="29%" className="pl-0">
                    Bukti Pengiriman
                  </TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>
                    {image ? (
                      <ImageWithSkeleton
                        className="w-[200px] h-[200px]"
                        src={image}
                        key={10}
                      />
                    ) : (
                      <div className="w-[200px] h-[200px] bg-slate-400"></div>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Separator />
            <h2 className="font-semibold text-2xl mt-2">Rincian Pengirim</h2>
            <Table>
              <TableBody>
                <TableRow className="border-0">
                  <TableCell width="29%" className="pl-0">
                    Nama Pengirim
                  </TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{pengiriman.pengirim.nama}</TableCell>
                </TableRow>
                <TableRow className="border-0">
                  <TableCell width="29%" className="pl-0">
                    Email
                  </TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{pengiriman.pengirim.email}</TableCell>
                </TableRow>
                <TableRow className="border-0">
                  <TableCell width="29%" className="pl-0">
                    Telepon
                  </TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{pengiriman.pengirim.telepon}</TableCell>
                </TableRow>
                <TableRow className="border-0">
                  <TableCell width="29%" className="pl-0">
                    Alamat
                  </TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>{pengiriman.pengirim.alamat}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        ) : (
          ""
        )}
      </div>
      {trackPengiriman ? (
        <div className="mt-7 py-5">
          <h2 className="font-semibold text-2xl">Tracking pengiriman</h2>
          <Table className="mt-5">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-0">Gudang</TableHead>
                <TableHead>Tanggal Sampai</TableHead>
                <TableHead>Keterangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trackPengiriman.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-0" width="25%">
                    {item.gudang.nama}
                  </TableCell>
                  <TableCell width="25%">
                    {formatDate(item.tanggal_sampai.toString())}
                  </TableCell>
                  <TableCell>{item.keterangan}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        ""
      )}
    </section>
  );
};

export default DetailPengiriman;
