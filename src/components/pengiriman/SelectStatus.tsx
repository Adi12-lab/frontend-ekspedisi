import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusPengiriman } from "@/types";
const SelectStatus = ({status,setStatus}: {status: StatusPengiriman,setStatus: (status: StatusPengiriman) => void}) => {
  return (
    <Select onValueChange={setStatus} defaultValue={status}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Status pengiriman" />
      </SelectTrigger>
      <SelectContent>
          <SelectItem value="BELUM_DIANGKUT">Belum Diangkut</SelectItem>
          <SelectItem value="DALAM_PENGIRIMAN">Dalam Pengiriman</SelectItem>
          <SelectItem value="TERKIRIM">Terkirim</SelectItem>
          <SelectItem value="DIBATALKAN">Dibatalkan</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectStatus;
