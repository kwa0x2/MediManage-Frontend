"use client";

// import TableBookImage from "@/components/table-book-image";
import { ColumnDef } from "@tanstack/react-table";
import ActionsTableCell from "./actions-table-cell";
import { useCurrentUser } from "@/hooks/use-current-user";

export type UserTableModel = {
  user_id: number;
  user_name: string;
  user_surname: string;
  user_identity_number: string;
  user_email: string;
  user_phone: string;
  user_password: string;
  user_role: string;
  user_hospital_id: string;
};


export const columns: ColumnDef<UserTableModel>[] = [
  {
    accessorKey: "user_name",
    header: "Adı",
  },
  {
    accessorKey: "user_surname",
    header: "Soyadı",
  },
  {
    accessorKey: "user_identity_number",
    header: "TC Kimlik Numarası",
  },
  {
    accessorKey: "user_email",
    header: "E-Posta",
  },
  {
    accessorKey: "user_phone",
    header: "Telefon Numarası",
  },
  {
    accessorKey: "user_role",
    header: "Rol",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const sesUser = useCurrentUser();
      if (sesUser?.role === "Staff"){
      return <ActionsTableCell user={user} />;
      }
    },
  },
];
