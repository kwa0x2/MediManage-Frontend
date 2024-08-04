import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { UserTableModel } from "../table/columns";
import { AddUserSchema } from "@/schemas/user";
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
import { postUser, putUser } from "@/app/api/services/user.Service";
import axios from "axios";

export const addUserEmitter = new EventEmitter();

interface AddUserDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  user?: UserTableModel;
}

const AddOrEditUserDialog: React.FC<AddUserDialogProps> = ({
  isOpen,
  setIsOpen,
  user,
}) => {
  useEffect(() => {
    if (user) {
      form.reset({
        user_name: user.user_name,
        user_surname: user.user_surname,
        user_identity_number: user.user_identity_number.toString(),
        user_email: user.user_email,
        user_phone: user.user_phone,
        user_role: user.user_role,
      });
    }
  }, [user]);

  const form = useForm<z.infer<typeof AddUserSchema>>({
    resolver: zodResolver(AddUserSchema),
    defaultValues: {
      user_name: "",
      user_surname: "",
      user_identity_number: "",
      user_email: "",
      user_phone: "",
      user_role: "",
      user_password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof AddUserSchema>) => {
    const formData = { ...values, user_id: user?.user_id };

    try {
      let res;
      if (user) {
        console.warn("user", formData);
        res = await putUser(formData);
        if (res.status !== 200) {
          console.log("error", res);
          throw new Error("addUser ile ilgili bir hata oluştu");
        } else {
          addUserEmitter.emit("updateGrid");
          setIsOpen(false);
          toast.success("Kullanıcı başarıyla güncellendi!");
        }
      } else {
        console.warn("user", formData);
        res = await postUser(formData);
        if (res.status === 201) {
          addUserEmitter.emit("updateGrid");
          setIsOpen(false);
          toast.success("Kullanıcı Eklendi", {
            description: `${formData.user_name} ${formData.user_surname}`,
          });
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          toast.error("Bu hastanede zaten bir başhekim mevcut");
        } else {
          console.error(`addOrEditUser try&catch hata -> ${error.message}`);
          toast.error("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        }
      } else {
        console.error(`addOrEditUser try&catch hata -> ${error}`);
        toast.error("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-center ">
            <div className="mx-auto grid gap-6">
              {user ? (
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold">Kullanıcı Güncelle</h1>
                  <p className="text-balance text-muted-foreground">
                    Kullanıcı bilgilerini güncelleyin
                  </p>
                </div>
              ) : (
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold">Yeni Kullanıcı Ekle</h1>
                  <p className="text-balance text-muted-foreground">
                    Hastanenize yeni bir kullanıcı ekleyin
                  </p>
                </div>
              )}
              <div className="grid gap-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-3 gap-4 pt-10">
                      <FormField
                        control={form.control}
                        name="user_name"
                        render={({ field }) => (
                          <FormItem className="grid gap-1">
                            <FormLabel>Adı*</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Alper"
                                type="text"
                                required
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="user_surname"
                        render={({ field }) => (
                          <FormItem className="grid gap-1 ">
                            <FormLabel>Soyadı*</FormLabel>
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
                        name="user_identity_number"
                        render={({ field }) => (
                          <FormItem className="grid gap-1 ">
                            <FormLabel>TC Kimlik Numarası*</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="11111111111"
                                type="number"
                                required
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-5 pb-5">
                      <FormField
                        control={form.control}
                        name="user_email"
                        render={({ field }) => (
                          <FormItem className="grid gap-1 ">
                            <FormLabel>E-Posta*</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="example@acmeitsupport.com"
                                type="email"
                                required
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="user_phone"
                        render={({ field }) => (
                          <FormItem className="grid gap-1 ">
                            <FormLabel>Telefon Numarası*</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="5301146058"
                                required
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-5 pb-5">
                      <FormField
                        control={form.control}
                        name="user_role"
                        render={({ field }) => (
                          <FormItem className="grid gap-1 ">
                            <FormLabel>Rol*</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => field.onChange(value)}
                                value={field.value}
                                required
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={"Seçim Yapınız"} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={"Staff"}>
                                    Yetili
                                  </SelectItem>
                                  <SelectItem value={"Worker"}>İşçi</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="user_password"
                        render={({ field }) => (
                          <FormItem className="grid gap-1">
                            <FormLabel>{user ? "Şifresi" : "Şifresi*"}</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" placeholder="********" required={!user} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      {user ? "Güncelle" : "Ekle"}
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

export default AddOrEditUserDialog;
