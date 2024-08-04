"use client";
import { ContentLayout } from "@/components/home/content-layout";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEffect } from "react";
import HizmetPoliklinikTable from "./table/table-page";

const PersonelPage = () => {
  const user = useCurrentUser();

  useEffect(() => {
    console.warn(user);
  }, []);

  return (
    <ContentLayout title="Hizmet Verilen Poliklinikler">
       <HizmetPoliklinikTable />

    </ContentLayout>

  );
};

export default PersonelPage;
