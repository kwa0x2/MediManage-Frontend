"use client";

// import TableBookImage from "@/components/table-book-image";
import { ColumnDef } from "@tanstack/react-table";
import ActionsTableCell from "./actions-table-cell";
import { useCurrentUser } from "@/hooks/use-current-user";

export type EmployeeTableModel = {
  employee_id: number;
  employee_name: string;
  employee_surname: string;
  employee_identity_number: string;
  employee_phone_number: string;
  employee_job_group_name: string;
  employee_title_name: string;
  employee_clinic_name: string;
  employee_working_days: string[]; // Burada anahtar adını doğru yazın
};


export const columns: ColumnDef<EmployeeTableModel>[] = [
  {
    accessorKey: "employee_name",
    header: "Adı",
  },
  {
    accessorKey: "employee_surname",
    header: "Soyadı",
  },
  {
    accessorKey: "employee_identity_number",
    header: "TC No",
  },
  {
    accessorKey: "employee_phone_number",
    header: "Telefon No",
  },
  {
    accessorKey: "employee_job_group_name",
    header: "Meslek Grubu",
  },
  {
    accessorKey: "employee_title_name",
    header: "Unvan",
  },
  {
    accessorKey: "employee_clinic_name",
    header: "Poliklinik",
  },
  {
    accessorKey: "employee_working_days",
    header: "Çalışma Günleri",
    cell: ({ getValue }) => {
      const workingDays = getValue() as string[] | undefined; 
      return (
        <div>
          {Array.isArray(workingDays) && workingDays?.length ? (
            workingDays?.join(", ") 
          ) : (
            "Gün Yok"
          )}
        </div>
      );
    },
  },  
  {
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original;
      const user = useCurrentUser();
      if (user?.role === "Staff"){
      return <ActionsTableCell employee={employee} />;
      }
    },
  },
];
