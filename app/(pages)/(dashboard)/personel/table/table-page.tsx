"use client";
// import { getMyBooks } from "@/app/_api/services/readingService";
import { useEffect, useState } from "react";
import { deleteEmployeeEmitter } from "../delete-dialog/delete-dialog";
import { EmployeeTableModel, columns } from "./columns";
import { DataTable } from "./data-table";
// import { updateMyBookEmitter } from "../edit-dialog/edit-dialog";
import { getAllEmployees } from "@/app/api/services/employee.Service";
import { addEmployeeEmitter } from "../add-or-edit-dialog/add-or-edit-dialog";

const PersonelTable = () => {
  const [employees, setEmployees] = useState<EmployeeTableModel[]>([]);

  useEffect(() => {
    fetchData();

    deleteEmployeeEmitter.on("updateGrid", fetchData);
    addEmployeeEmitter.on("updateGrid", fetchData);

    return () => {
      deleteEmployeeEmitter.off("updateGrid", fetchData);
      addEmployeeEmitter.off("updateGrid", fetchData);

    };
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAllEmployees();

      console.log("grid",res.data)
      if (res.status !== 200) {
        throw new Error("Reading ile ilgili bir hata oluştu");
      }
      
      setEmployees(res.data);
    } catch (error) {
      console.warn("employee try&catch hata -> ", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={employees} />
    </div>
  );
};

export default PersonelTable;
