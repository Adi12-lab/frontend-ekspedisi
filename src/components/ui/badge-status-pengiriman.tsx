import { StatusPengiriman } from "@/types";
import { Badge } from "./badge";
export const BadgeStatusPengiriman = ({status}: {status: StatusPengiriman}) => {
  let badgeColor:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "teal"
    | "emerald"
    | null
    | undefined;
  switch (status) {
    case "BELUM_DIANGKUT":
      badgeColor = "secondary";
      break;
    case "DALAM_PENGIRIMAN":
      badgeColor = "teal";
      break;
    case "TERKIRIM":
      badgeColor = "emerald";
      break;
    case "DIBATALKAN":
      badgeColor = "destructive";
      break;
  }
  return (
    <Badge className="capitalize" variant={badgeColor}>
      {status}
    </Badge>
  );
};

