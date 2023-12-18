import { useEffect, useState, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  FileEdit,
  Map,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";

import { UserContext } from "@/App";

import type {
  Pengiriman as PengirimanType,
  Notify,
  SelectedPengiriman,
} from "@/types";
import ServicePengiriman from "@/actions/pengiriman";

import AddPengiriman from "@/components/pengiriman/AddPengiriman";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeStatusPengiriman } from "@/components/ui/badge-status-pengiriman";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditPengiriman from "@/components/pengiriman/EditPengiriman";
import DeletePengiriman from "@/components/pengiriman/DeletePengiriman";
import { formatRupiah } from "@/lib/utils";
import AnimationWrapper from "@/components/layout/page-animation";

type SetSelectedFunction = React.Dispatch<
  React.SetStateAction<SelectedPengiriman>
>;
type SetOpen = React.Dispatch<React.SetStateAction<boolean>>;

function getTableColumns(
  setSelected: SetSelectedFunction,
  setOpen: SetOpen
): ColumnDef<PengirimanType>[] {
  return [
    {
      accessorKey: "status", //sebagai key
      header: "Status",
      cell: ({ row }) => <BadgeStatusPengiriman status={row.getValue("status")} />
      ,
    },
    {
      accessorKey: "resi",
      header: () => {
        return <div>Resi</div>;
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("resi")}</div>
      ),
    },
    {
      accessorKey: "nama_barang",
      header: () => <div>Nama Barang</div>,
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("nama_barang")}</div>;
      },
    },
    {
      accessorKey: "biaya",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Biaya
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const biaya = parseFloat(row.getValue("biaya"));
        return <div className="font-medium">{formatRupiah(biaya)}</div>;
      },
    },
    {
      accessorKey: "kuantitas",
      header: () => <div>Kuantitas</div>,
      cell: ({ row }) => {
        return <div>{row.getValue("kuantitas")} buah</div>;
      },
    },
    {
      accessorKey: "pengirim", //sebagai key
      header: "Pengirim",
      cell: ({ row }) => {
        const pengiriman = row.original;
        return <div>{pengiriman.pengirim.nama}</div>;
      },
    },
    {
      id: "aksi",
      enableHiding: false,
      cell: ({ row }) => {
        const pengiriman = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(pengiriman.resi as string)
                }
              >
                Salin resi
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={"/pengiriman/" + pengiriman.resi + "/details"}>
                  Detail Pengiriman
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={"/pengiriman/" + pengiriman.resi + "/track"}>
                  <Map className="w-4 h-4 text-green-300 me-3" />
                  Track pengiriman
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelected({
                    pengiriman,
                    operation: "edit",
                  });
                  setOpen(true);
                }}
              >
                <FileEdit className="w-4 h-4 text-yellow-300 me-3" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelected({
                    pengiriman,
                    operation: "delete",
                  });
                  setOpen(true);
                }}
              >
                <Trash2 className="w-4 h-4 text-red-600 me-3" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

export default function Pengiriman() {
  const {
    userAuth: { accessToken },
  } = useContext(UserContext);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<PengirimanType[]>([]);
  const [selected, setSelected] = useState<SelectedPengiriman>({
    pengiriman: undefined,
    operation: null,
  });
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [notify, setNotify] = useState<Notify>({
    type: null,
    message: "",
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns: getTableColumns(setSelected, setOpen),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    const getPengiriman = async () => {
      if(accessToken) {
        const result = await ServicePengiriman.getDataPengiriman(accessToken);
        setData(result.data);
      }
    };

    if (refresh) {
      getPengiriman();
      if (notify.type === "success" && refresh) {
        toast.success(notify.message);
      } else if (notify.type === "error") {
        toast.error(notify.message);
      }
      setRefresh(false);
    }
  }, [refresh, notify, accessToken]);

  return accessToken === null ? (
    <Navigate to="/login" />
  ) : (
    <AnimationWrapper keyValue={"pengiriman"}>
      <Toaster position="top-center" reverseOrder={false} />
      <div>
        <h1 className="font-bold text-3xl text-center">Daftar Pengiriman</h1>
        <AddPengiriman setRefresh={setRefresh} setNotify={setNotify} />
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari resi"
          value={(table.getColumn("resi")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("resi")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={getTableColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <EditPengiriman
        open={selected.operation === "edit" && open}
        setOpen={setOpen}
        data={selected.pengiriman as PengirimanType}
        setRefresh={setRefresh}
        setNotify={setNotify}
      />
      <DeletePengiriman
        open={selected.operation === "delete" && open}
        setOpen={setOpen}
        data={selected.pengiriman as PengirimanType}
        setRefresh={setRefresh}
        setNotify={setNotify}
      />
    </AnimationWrapper>
  );
}
