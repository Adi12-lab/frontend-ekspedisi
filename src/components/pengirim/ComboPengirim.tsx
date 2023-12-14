import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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


export function ComboPengirim(
    {
        idPengirimData, //untuk update
        setIdPengirim}: 
    {
        idPengirimData?: string, 
        setIdPengirim: (id: string)=> void}) {
            
  const [open, setOpen] = useState(false);
  
  const [lowerName, setLowerName] = useState("")
 
  const [pengirim, setPengirim] = useState<Pengirim[]>([]);
  
  useEffect(() => {
    const getPengirim = async () => {
        const result = await ServicePengirim.getDataPengirim();
        setPengirim(result.data);
      
    };
    getPengirim()
  }, []);

  useEffect(()=> {
    if(idPengirimData && pengirim) {
      const foundPengirim = pengirim.find((PengirimItem) => PengirimItem.id === idPengirimData);
      if (foundPengirim) {
        setLowerName(foundPengirim.nama);
      }
    }
  },[idPengirimData, pengirim])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {lowerName
            ? pengirim.find((pengirimItem) => pengirimItem.nama === lowerName )?.nama
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
                  setLowerName(currentValue ===  lowerName ? "" : currentValue); //jika user meng klik lagi maka akan membatalkan
                  setIdPengirim(pengirimItem.id as string)
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    lowerName === pengirimItem.nama ? "opacity-100" : "opacity-0"
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
