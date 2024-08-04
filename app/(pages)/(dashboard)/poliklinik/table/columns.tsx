"use client";

// import TableBookImage from "@/components/table-book-image";
import { ColumnDef } from "@tanstack/react-table";
import ActionsTableCell from "./actions-table-cell";
import { useCurrentUser } from "@/hooks/use-current-user";

export type HospitalClinicTableModel = {
  hospital_id: number;
  clinic_name: string;
  total_employees:string
  doktor_count:string
  hizmet_personeli_count:string
  idari_personel_count:string
};


export const columns: ColumnDef<HospitalClinicTableModel>[] = [
  {
    accessorKey: "clinic_name",
    header: "Hizmet Verilen Poliklinik",
  },
  {
    accessorKey: "total_employees",
    header: "Toplam Çalışan",
  },
  {
    accessorKey: "doktor_count",
    header: "Toplam Doktor",
  },
  {
    accessorKey: "hizmet_personeli_count",
    header: "Toplam Hizmet Personeli",
  },
  {
    accessorKey: "idari_personel_count",
    header: "Toplam İdari Personel",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const hospitalClinic = row.original;
      const user = useCurrentUser();
      if (user?.role === "Staff"){
        return <ActionsTableCell hospitalClinic={hospitalClinic} />;
      }
    },
  },
];
