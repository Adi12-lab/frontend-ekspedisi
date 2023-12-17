import { useEffect, useState, useContext } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { Loader2 } from "lucide-react";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageWithSkeleton } from "@/components/ui/image-skeleton";
import { Separator } from "@/components/ui/separator";
import { BadgeStatusPengiriman } from "@/components/ui/badge-status-pengiriman";
import { Button } from "@/components/ui/button";

const DetailPengirimanSearch = () => {
  const {
    userAuth: { accessToken },
  } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [pengiriman, setPengiriman] = useState<Pengiriman>();
  const [trackPengiriman, setTrackPengiriman] = useState<TrackPengirimanType[]>(
    []
  );
  const [image, setImage] = useState<string>();
  const [form, setForm] = useState({
    resi: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchImage = async (imageData: string) => {
      const imageUrl = await getDownloadURL(ref(storage, imageData));
      setImage(imageUrl);
    };
    if (pengiriman?.bukti_pengiriman) fetchImage(pengiriman.bukti_pengiriman);
  }, [pengiriman]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const resultPengiriman = await ServicePengiriman.findDataPengirimanByResi(
        form.resi,
        accessToken
      );
      const resultTrackPengiriman =
        await ServiceTrackPengiriman.getDataTrackPengirimanByResi(
          form.resi,
          accessToken
        );
      setPengiriman(resultPengiriman.data);
      setTrackPengiriman(resultTrackPengiriman.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {pengiriman ? (
        <Result pengiriman={pengiriman} trackPengiriman={trackPengiriman} image={image}/>
      ) : (
        <section className="container">
          <Card className="w-[600px]">
            <CardHeader>
              <CardTitle>Cari barang anda</CardTitle>
              <CardDescription>
                Lacak setiap saat petualangan barang anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Resi barang"
                  name="resi"
                  onChange={handleChange}
                />
                {loading ? (
                  <Button type="submit" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan
                  </Button>
                ) : (
                  <Button type="submit">Simpan</Button>
                )}
              </form>
            </CardContent>
          </Card>
        </section>
      )}
    </>
  );
};

const Result = ({pengiriman, trackPengiriman, image}: {pengiriman: Pengiriman, trackPengiriman: TrackPengirimanType[], image?: string}) => {
  return (
    <>
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
    </>
  );
};
export default DetailPengirimanSearch;
