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

import ServiceGudang from "@/actions/gudang";
import { Gudang } from "@/types";


export function ComboGudang(
    {
        idGudangData, //untuk update
        setIdGudang}: 
    {
        idGudangData?: string, 
        setIdGudang: (id: string)=> void}) {
            
  const [open, setOpen] = useState(false);
  
  const [lowerName, setLowerName] = useState("")
 
  const [gudang, setGudang] = useState<Gudang[]>([]);
  
  useEffect(() => {
    const getGudang = async () => {
        const result = await ServiceGudang.getDataGudang();
        setGudang(result.data);
      
    };
    getGudang()
  }, []);

  useEffect(()=> {
    if(idGudangData && gudang) {
      const foundGudang = gudang.find((gudangItem) => gudangItem.id === idGudangData);
      if (foundGudang) {
        setLowerName(foundGudang.nama.toLowerCase());
      }
    }
  },[idGudangData, gudang])

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
            ? gudang.find((gudangItem) => gudangItem.nama.toLowerCase() === lowerName )?.nama
            : "Pilih Gudang..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Cari Gudang..." />
          <CommandEmpty>Tidak ditemukan Gudang</CommandEmpty>
          <CommandGroup>
            {gudang.map((gudangItem) => (
              <CommandItem
                key={gudangItem.id}
                value={gudangItem.nama.toLowerCase()}
                onSelect={(currentValue) => {
                  setLowerName(currentValue ===  lowerName ? "" : currentValue); //jika user meng klik lagi maka akan membatalkan
                  setIdGudang(gudangItem.id as string)
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    lowerName === gudangItem.nama ? "opacity-100" : "opacity-0"
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
