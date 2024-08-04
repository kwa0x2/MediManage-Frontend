"use client";
// import { getMyBooks } from "@/app/_api/services/readingService";
import { useEffect, useState } from "react";
import { deleteUserEmitter } from "../delete-dialog/delete-dialog";
import { UserTableModel, columns } from "./columns";
import { DataTable } from "./data-table";
// import { updateMyBookEmitter } from "../edit-dialog/edit-dialog";
import { getAllUser } from "@/app/api/services/user.Service";
import { addUserEmitter } from "../add-or-edit-dialog/add-or-edit-dialog";

const KullaniciTable = () => {
  const [users, setUsers] = useState<UserTableModel[]>([]);

  useEffect(() => {
    fetchData();

    deleteUserEmitter.on("updateGrid", fetchData);
    addUserEmitter.on("updateGrid", fetchData);

    return () => {
      deleteUserEmitter.off("updateGrid", fetchData);
      addUserEmitter.off("updateGrid", fetchData);
    };
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAllUser();

      console.log("grid", res.data);
      if (res.status !== 200) {
        throw new Error("Reading ile ilgili bir hata oluştu");
      }

      setUsers(res.data);
    } catch (error) {
      console.warn("kullanici try&catch hata -> ", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default KullaniciTable;
