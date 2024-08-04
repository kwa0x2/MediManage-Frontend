"use client";
import { useEffect, useState } from "react";
import { deleteClinicEmitter } from "../delete-dialog/delete-dialog";
import { HospitalClinicTableModel, columns } from "./columns";
import { DataTable } from "./data-table";
import { addClinicEmitter } from "../add-or-edit-dialog/add-or-edit-dialog";
import { getAllHospitalClinicData } from "@/app/api/services/clinic.Service";

const HizmetPoliklinikTable = () => {
  const [employees, setEmployees] = useState<HospitalClinicTableModel[]>([]);

  useEffect(() => {
    fetchData();

    deleteClinicEmitter.on("updateGrid", fetchData);
    addClinicEmitter.on("updateGrid", fetchData);

    return () => {
      deleteClinicEmitter.off("updateGrid", fetchData);
      addClinicEmitter.off("updateGrid", fetchData);
    };
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAllHospitalClinicData();

      console.log("grid",res.data)
      if (res.status !== 200) {
        throw new Error("Poliklinik ile ilgili bir hata oluştu");
      }
      
      setEmployees(res.data);
    } catch (error) {
      console.warn("clinic try&catch hata -> ", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={employees} />
    </div>
  );
};

export default HizmetPoliklinikTable;
