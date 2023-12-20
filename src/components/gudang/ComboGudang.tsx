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

import ServiceGudang from "@/actions/gudang";
import { Gudang } from "@/types";

export function ComboGudang({
  idGudangData,
  setIdGudang,
}: {
  idGudangData?: string;
  setIdGudang: (id: string) => void;
}) {
  const {
    userAuth: { accessToken },
  } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  const [gudang, setGudang] = useState<Gudang[]>([]);

  useEffect(() => {
    const getGudang = async () => {
      if (accessToken) {
        const result = await ServiceGudang.getDataGudang(accessToken);
        setGudang(result.data);
      }
    };
    getGudang();
  }, [accessToken]);


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {idGudangData
            ? gudang.find((gudangItem) => gudangItem.id === idGudangData)?.nama
            : "Pilih Gudang..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command value={idGudangData}>
          <CommandInput placeholder="Cari Gudang..." />
          <CommandEmpty>Tidak ditemukan Gudang</CommandEmpty>
          <CommandGroup>
            {gudang.map((gudangItem) => (
              <CommandItem
                key={gudangItem.id}
                value={gudangItem.nama.toLowerCase()}
                onSelect={(currentValue) => {
                  setIdGudang(
                    idGudangData &&
                      (gudang.find(
                        (gudangItem) => gudangItem.id === idGudangData
                    )?.nama.toLowerCase() === currentValue) //jika ada id gudang dan nilai dari current lower case sama dengan yang lowercase yang diari dengan idGUdang  maka, kosongkan idGudang
                      ? ""
                      : (gudangItem.id as string)
                  );
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    idGudangData === gudangItem.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {gudangItem.nama}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
