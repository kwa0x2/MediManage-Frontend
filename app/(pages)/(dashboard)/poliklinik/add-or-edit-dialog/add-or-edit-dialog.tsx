import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { HospitalClinicTableModel } from "../table/columns";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import EventEmitter from "events";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import {
  postEmployeeWithWorkDays,
  putEmployeeWithWorkDays,
} from "@/app/api/services/employee.Service";
import axios from "axios";
import { AddHospitalClinicSchema } from "@/schemas/hospitalClinic";
import {
  getAllClinicData,
  postHospitalClinic,
  putHospitalClinic,
} from "@/app/api/services/clinic.Service";

export const addClinicEmitter = new EventEmitter();

interface AddEmployeeDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hospitalClinic?: any;
}

type Checked = DropdownMenuCheckboxItemProps["checked"];

const AddOrEditHospitalClinicDialog: React.FC<AddEmployeeDialogProps> = ({
  isOpen,
  setIsOpen,
  hospitalClinic,
}) => {
  const [selectedWorkingDays, setSelectedWorkingDays] = useState<string[]>([]);
  const [clinicNames, setClinicNames] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchClinicData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (hospitalClinic) {
      const clinicNamesFromData = hospitalClinic.map(
        (clinic: any) => clinic.clinic_name
      );
      setSelectedWorkingDays(clinicNamesFromData);
    }
  }, [hospitalClinic]);

  const fetchClinicData = async () => {
    try {
      const res = await getAllClinicData();
      if (res.status === 200) {
        setClinicNames(res.data);
      } else {
        console.warn("Klinik verileri alınamadı", res);
      }
    } catch (error) {
      console.error("Klinik verilerini alırken hata oluştu:", error);
    }
  };

  const handleDayChange = (day: string, checked: boolean) => {
    setSelectedWorkingDays((prevDays) =>
      checked ? [...prevDays, day] : prevDays.filter((d) => d !== day)
    );
  };

  const form = useForm<z.infer<typeof AddHospitalClinicSchema>>({
    resolver: zodResolver(AddHospitalClinicSchema),
    defaultValues: {
      add_clinic_data: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof AddHospitalClinicSchema>) => {
    if (selectedWorkingDays.length === 0) {
      toast.error("Çalışma günleri seçilmelidir!");
      return;
    }

    const formData = {
      ...values,
      add_clinic_data: selectedWorkingDays,
    };

    console.warn("asda", hospitalClinic);

    try {
      let res;
      if (hospitalClinic?.length > 0) {
        console.warn("asda2", formData);

        res = await putHospitalClinic(
          formData,
        );
        if (res.status !== 200) {
          throw new Error("Poliklinik güncelleme hatası");
        } else {
          addClinicEmitter.emit("updateGrid");
          setIsOpen(false);
          toast.success("Poliklinikler başarıyla güncellendi!");
        }
      } else {
        res = await postHospitalClinic(formData);
        if (res.status === 201) {
          addClinicEmitter.emit("updateGrid");
          setIsOpen(false);
          const clinicDataString = formData.add_clinic_data.join(', ');

          toast.success("Poliklinik eklendi", {
            description: clinicDataString,
          });
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          toast.error("Bu hastanede zaten bir başhekim mevcut");
        } else {
          console.error("addOrEditEmployee hata:", error.message);
          toast.error("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        }
      } else {
        console.error("addOrEditEmployee hata:", error);
        toast.error("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <div className="flex items-center justify-center">
            <div className="mx-auto grid gap-6">
              {hospitalClinic ? (
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold">
                    Poliklinikleri Güncelle
                  </h1>
                  <p className="text-balance text-muted-foreground">
                    Hizmet verilen poliklinikleri güncelleyin
                  </p>
                </div>
              ) : (
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold">Yeni Poliklinik Ekle</h1>
                  <p className="text-balance text-muted-foreground">
                    Hastane hizmetinize yeni poliklinik ekleyin
                  </p>
                </div>
              )}
              <div className="grid gap-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="add_clinic_data"
                      render={({ field }) => (
                        <FormItem className="grid gap-1 pt-5">
                          <FormLabel>Klinik Adı*</FormLabel>
                          <FormControl>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full">
                                  Hizmet Verilecek Klinikleri Seç
                                  <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Klinikler</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {clinicNames.map((clinic) => (
                                  <DropdownMenuCheckboxItem
                                    key={clinic?.clinic_name}
                                    checked={selectedWorkingDays.includes(
                                      clinic.clinic_name
                                    )}
                                    onCheckedChange={(checked: Checked) =>
                                      handleDayChange(
                                        clinic.clinic_name,
                                        checked as boolean
                                      )
                                    }
                                  >
                                    {clinic.clinic_name}
                                  </DropdownMenuCheckboxItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full mt-5">
                      {hospitalClinic ? "Güncelle" : "Ekle"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrEditHospitalClinicDialog;
