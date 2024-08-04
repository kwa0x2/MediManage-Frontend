import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { EmployeeTableModel } from "../table/columns";
import { AddEmployeeSchema } from "@/schemas/reading";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import EventEmitter from "events";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllJobGroups } from "@/app/api/services/jobGroup.Service";
import { getAllTitleByJobGroupName } from "@/app/api/services/title.Service";
import { getAllClinicData, getAllHospitalClinicData } from "@/app/api/services/clinic.Service";
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

export const addEmployeeEmitter = new EventEmitter();

interface AddEmployeeDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  employee?: EmployeeTableModel;
}

type Checked = DropdownMenuCheckboxItemProps["checked"];

const AddOrEditEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({
  isOpen,
  setIsOpen,
  employee,
}) => {
  const [jobGroupsSelect, setJobGroupsSelect] = useState<any[]>([]);
  const [titlesSelect, setTitlesSelect] = useState<any[]>([]);
  const [clinicSelect, setClinicSelect] = useState<any[]>([]);
  const [selectedJobGroup, setSelectedJobGroup] = useState<string>(
    employee?.employee_job_group_name || ""
  );
  const [selectedTitle, setSelectedTitle] = useState<string>(
    employee?.employee_title_name || ""
  );
  const [selectedWorkingDays, setSelectedWorkingDays] = useState<string[]>(
    employee?.employee_working_days || []
  );

  useEffect(() => {
    if (isOpen) {
      fetchJobGroupData();
      if (employee) {
        fetchTitleData(employee.employee_job_group_name);
        fetchClinicData();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (employee) {
      form.reset({
        employee_name: employee.employee_name,
        employee_surname: employee.employee_surname,
        employee_identity_number: employee.employee_identity_number.toString(),
        employee_phone_number: employee.employee_phone_number,
        employee_job_group_name: employee.employee_job_group_name,
        employee_title_name: employee.employee_title_name,
        employee_clinic_name: employee.employee_clinic_name,
        employee_working_days: employee.employee_working_days,
      });
    }
  }, [employee]);

  const fetchJobGroupData = async () => {
    const res = await getAllJobGroups();
    if (res.status == 200) {
      console.log(res);
      setJobGroupsSelect(res.data);
    } else {
      console.warn("ya arkadaşlık isteği yok yada hata var", res);
    }
  };

  const fetchTitleData = async (jobGroupName: string) => {
    const res = await getAllTitleByJobGroupName(jobGroupName);
    if (res.status == 200) {
      console.log(res);
      setTitlesSelect(res.data);
    } else {
      console.warn("ya arkadaşlık isteği yok yada hata var", res);
    }
  };

  const fetchClinicData = async () => {
    const res = await getAllHospitalClinicData();
    if (res.status == 200) {
      console.log(res);
      setClinicSelect(res.data);
    } else {
      console.warn("ya arkadaşlık isteği yok yada hata var", res);
    }
  };

  const handleDayChange = (day: string, checked: boolean) => {
    setSelectedWorkingDays((prevDays) =>
      checked ? [...prevDays, day] : prevDays.filter((d) => d !== day)
    );
  };

  const handleJobGroupChange = (value: string) => {
    fetchTitleData(value);
    form.setValue("employee_job_group_name", value);
    setSelectedJobGroup(value);
    setSelectedTitle("");
    form.setValue("employee_title_name", "");
    form.setValue("employee_clinic_name", "");
  };

  const handleTitleChange = async (value: string) => {
    setSelectedTitle(value);
    form.setValue("employee_title_name", value);
    if (value === "Temizlikçi") {
      form.setValue("employee_clinic_name", "");
    } else {
      fetchClinicData();
    }
  };

  const form = useForm<z.infer<typeof AddEmployeeSchema>>({
    resolver: zodResolver(AddEmployeeSchema),
    defaultValues: {
      employee_name: "",
      employee_surname: "",
      employee_identity_number: "",
      employee_phone_number: "",
      employee_job_group_name: "",
      employee_title_name: "",
      employee_clinic_name: "",
      employee_working_days: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof AddEmployeeSchema>) => {
    if (selectedWorkingDays.length === 0) {
      toast.error("Çalışma günleri seçilmelidir!");
      return;
    }

    const formData = {
      ...values,
      employee_working_days: selectedWorkingDays,
    };

    try {
      let res;
      if (employee) {
        console.warn("employee", employee);
        res = await putEmployeeWithWorkDays(
          formData,
          Number(employee.employee_id)
        );
        if (res.status !== 200) {
          console.log("error", res);
          throw new Error("addMyLibrary ile ilgili bir hata oluştu");
        } else {
          addEmployeeEmitter.emit("updateGrid");
          setIsOpen(false);
          toast.success("Personel başarıyla güncellendi!");
        }
      } else {
        res = await postEmployeeWithWorkDays(formData);
        if (res.status === 201) {
          addEmployeeEmitter.emit("updateGrid");
          setIsOpen(false);
          toast.success("Personel Eklendi", {
            description: `${formData.employee_name} ${formData.employee_surname}`,
          });
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.error || error.message;        
        if (statusCode === 409) {
          toast.error("Bu hastanede zaten bir başhekim mevcut");
        } else if (errorMessage.includes("duplicate key value violates unique constraint")) {
          toast.error("Bu TC Kimlik numarası veya Telefon Numarası zaten kullanılıyor.");
        } else {
          console.error(`addOrEditEmployee try&catch hata -> ${errorMessage}`);
          toast.error("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        }
      } else {
        console.error(`addOrEditEmployee try&catch hata -> ${error}`);
        toast.error("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    }

    console.warn("formData", formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-center ">
            <div className="mx-auto grid gap-6">
              {employee ? (
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold">Personel Güncelle</h1>
                  <p className="text-balance text-muted-foreground">
                    Personel bilgilerini güncelleyin
                  </p>
                </div>
              ) : (
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold">Yeni Personel Ekle</h1>
                  <p className="text-balance text-muted-foreground">
                    Hastanenize yeni bir personel ekleyin
                  </p>
                </div>
              )}
              <div className="grid gap-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-3 gap-4 pt-10">
                      <FormField
                        control={form.control}
                        name="employee_name"
                        render={({ field }) => (
                          <FormItem className="grid gap-1">
                            <FormLabel>Personel Adı*</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Alper"
                                type="text"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employee_surname"
                        render={({ field }) => (
                          <FormItem className="grid gap-1 ">
                            <FormLabel>Personel Soyadı*</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Karakoyun"
                                required
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employee_identity_number"
                        render={({ field }) => (
                          <FormItem className="grid gap-1 ">
                            <FormLabel>Personel TC Kimlik Numarası*</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="11111111111"
                                type="number"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-5 pb-5">
                      <FormField
                        control={form.control}
                        name="employee_phone_number"
                        render={({ field }) => (
                          <FormItem className="grid gap-1 ">
                            <FormLabel>Personel Telefon Numarası*</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="05555555555"
                                type="tel"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employee_job_group_name"
                        render={({ field }) => (
                          <FormItem className="grid gap-1 ">
                            <FormLabel>Personel Meslek Grubu*</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) =>
                                  handleJobGroupChange(value)
                                }
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seçim Yapınız" />
                                </SelectTrigger>
                                <SelectContent>
                                  {jobGroupsSelect.map((option) => (
                                    <SelectItem
                                      key={option.jobgroup_name}
                                      value={option.jobgroup_name}
                                    >
                                      {option.jobgroup_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="employee_title_name"
                        render={({ field }) => (
                          <FormItem className="grid gap-1 ">
                            <FormLabel>Personel Unvanı*</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) =>
                                  handleTitleChange(value)
                                }
                                value={field.value}
                                disabled={!selectedJobGroup}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      selectedJobGroup
                                        ? "Seçim Yapınız"
                                        : "Önce Meslek Grubu Seçiniz"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {titlesSelect.map((option) => (
                                    <SelectItem
                                      key={option.title_name}
                                      value={option.title_name}
                                    >
                                      {option.title_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-5 pb-5">
                      <FormField
                        control={form.control}
                        name="employee_clinic_name"
                        render={({ field }) => (
                          <FormItem className="grid gap-1 ">
                            <FormLabel>Personel Poliklinik Adı*</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => field.onChange(value)}
                                value={field.value}
                                disabled={
                                  !selectedTitle ||
                                  selectedTitle === "Temizlikçi"
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      !selectedTitle
                                        ? "Önce Unvan Seçiniz"
                                        : selectedTitle === "Temizlikçi"
                                        ? "Bu unvan için uygun değil"
                                        : "Seçim Yapınız"
                                    }
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {clinicSelect.map((option) => (
                                    <SelectItem
                                      key={option.clinic_name}
                                      value={option.clinic_name}
                                    >
                                      {option.clinic_name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="employee_working_days"
                        render={({ field }) => (
                          <FormItem className="grid gap-1 pt-5">
                            <FormLabel>Personel Çalışma Günleri*</FormLabel>
                            <FormControl>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" className="w-full">
                                    Günleri Seç
                                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                  <DropdownMenuLabel>
                                    Çalışma Günlerini Seç
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {[
                                    "Pazartesi",
                                    "Salı",
                                    "Çarşamba",
                                    "Perşembe",
                                    "Cuma",
                                    "Cumartesi",
                                    "Pazar"
                                  ].map((day) => (
                                    <DropdownMenuCheckboxItem
                                      key={day}
                                      checked={selectedWorkingDays.includes(
                                        day
                                      )}
                                      onCheckedChange={(checked: Checked) =>
                                        handleDayChange(day, checked as boolean)
                                      }
                                    >
                                      {day}
                                    </DropdownMenuCheckboxItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit"  className="w-full">
                      {employee ? "Güncelle" : "Ekle"}
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

export default AddOrEditEmployeeDialog;
