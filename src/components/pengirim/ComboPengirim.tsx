import { useState, useEffect, useContext } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { UserContext } from "@/App";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import ServicePengirim from "@/actions/pengirim";
import { Pengirim } from "@/types";

export function ComboPengirim({
  idPengirimData,
  setIdPengirim,
}: {
  idPengirimData?: string;
  setIdPengirim: (id: string) => void;
}) {
  const {
    userAuth: { accessToken },
  } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const [pengirim, setPengirim] = useState<Pengirim[]>([]);

  useEffect(() => {
    const getPengirim = async () => {
      if (accessToken) {
        const result = await ServicePengirim.getDataPengirim(accessToken);
        setPengirim(result.data);
      }
    };
    getPengirim();
  }, [accessToken]);

  return (
    <Popover
      open={open}
      onOpenChange={() => {
        setOpen((state) => !state);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {idPengirimData
            ? pengirim.find(
                (pengirimItem) => pengirimItem.id === idPengirimData
              )?.nama
            : "Pilih Pengirim..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Cari Pengirim..." />
          <CommandEmpty>Tidak ditemukan Pengirim</CommandEmpty>
          <CommandGroup>
            {pengirim.map((pengirimItem) => (
              <CommandItem
                key={pengirimItem.id}
                value={pengirimItem.nama}
                onSelect={(currentValue) => {
                  //setLowerName(currentValue === lowerName ? "" : currentValue); //jika user meng klik lagi maka akan membatalkan
                  setIdPengirim(
                    idPengirimData &&
                      (pengirim.find(
                        (item) => item.id === idPengirimData
                    )?.nama.toLowerCase() === currentValue) //jika ada id pengirim dan nilai dari current lower case sama dengan yang lowercase yang diari dengan id pengirim  maka, kosongkan id pengirim
                      ? ""
                      : (pengirimItem.id as string)
                  );
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    idPengirimData === pengirimItem.id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {pengirimItem.nama}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
