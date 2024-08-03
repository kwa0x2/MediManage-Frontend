"use client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllProvinces } from "@/app/api/services/province.Service";
import { Register } from "@/app/api/services/auth.Service";
import { getAllDistrictsByProvince } from "@/app/api/services/district.Service";

const RegisterPage = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [provinceSelect, setProvinceSelect] = useState<any[]>([]);
  const [districtSelect, setDistrictSelect] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const router = useRouter()

  
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      hospital_name: "",
      hospital_tax_identity_number: "",
      hospital_email: "",
      hospital_phone_number: "",
      hospital_province_name: "",
      hospital_district_name: "",
      hospital_address: "",
      user_name: "",
      user_surname: "",
      user_identity_number: "",
      user_email: "",
      user_phone: "",
      user_password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    console.log(values);

    const res = await Register(values);
    if (res.status == 201) {
      console.log(res);
      router.push("/")

    } else {
      console.warn("kayit olurken hata", res);
    }
  };

  useEffect(() => {
    fetchProvinceData();
  }, []);

  const fetchProvinceData = async () => {
    const res = await getAllProvinces();
    if (res.status == 200) {
      console.log(res);
      setProvinceSelect(res.data);
    } else {
      console.warn("ya arkadaşlık isteği yok yada hata var", res);
    }
  };

  const fetchDistrictData = async (provinceName: string) => {
    const res = await getAllDistrictsByProvince(provinceName);
    if (res.status == 200) {
      console.log(res);
      setDistrictSelect(res.data);

    } else {
      console.warn("District verisi alınırken hata", res);
    }
  };

  const handleProvinceChange = (value: string) => {
    fetchDistrictData(value);
    form.setValue("hospital_province_name", value);
    setSelectedProvince(value);
    form.setValue("hospital_district_name", "");
  };


  return (
    <div className="w-full  h-screen flex justify-center items-center">
      {/* <div className="shadow-2xl lg:col-span-0 bg-muted lg:block">
            <Image
            src="/office-stock.jpg"
            alt="Image"
            width="1920"
            height="1080"
            className="h-screen shadow-2xl w-auto object-cover dark:brightness-[0.2] dark:grayscale"
            />
        </div> */}
      <div className="flex items-center justify-center ">
        <div className="mx-auto grid w-[800px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Kayıt Ol</h1>
            <p className="text-balance text-muted-foreground">
              Hastanenizi oluşturmak için bilgilerinizi girin
            </p>
          </div>
          <div className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-3 gap-4 ">
                  {/* name */}
                  <FormField
                    control={form.control}
                    name="hospital_name"
                    render={({ field }) => (
                      <FormItem className="grid gap-1">
                        <FormLabel>Hastane Adı*</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="VatanSoft Hastanesi"
                            type="text"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {/* surname */}
                  <FormField
                    control={form.control}
                    name="hospital_tax_identity_number"
                    render={({ field }) => (
                      <FormItem className="grid gap-1">
                        <FormLabel>Hastane Vergi Kimlik Numarası*</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="1111111111"
                            type="text"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hospital_email"
                    render={({ field }) => (
                      <FormItem className="grid gap-1 ">
                        <FormLabel>Hastane E-Posta Adresi*</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="example@acmeitsupport.com"
                            type="email"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-5">
                  <FormField
                    control={form.control}
                    name="hospital_phone_number"
                    render={({ field }) => (
                      <FormItem className="grid gap-1 ">
                        <FormLabel>Hastane Telefon Numarası*</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="hospital_province_name"
                    render={({ field }) => (
                      <FormItem className="grid gap-1 ">
                        <FormLabel>Hastane İl*</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value: any) => {
                              field.onChange(value);
                              handleProvinceChange(value);
                            }}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seçim Yapınız" />
                            </SelectTrigger>
                            <SelectContent>
                              {provinceSelect.map((option) => (
                                <SelectItem
                                  key={option.province_name}
                                  value={option.province_name}
                                >
                                  {option.province_name}
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
                    name="hospital_district_name"
                    render={({ field }) => (
                      <FormItem className="grid gap-1 ">
                        <FormLabel>Hastane İlçe*</FormLabel>
                        <FormControl>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!selectedProvince}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  selectedProvince
                                    ? "Seçim Yapınız"
                                    : "Önce İl Seçiniz"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {districtSelect.map((option) => (
                                <SelectItem
                                  key={option.district_name}
                                  value={option.district_name}
                                >
                                  {option.district_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="hospital_address"
                  render={({ field }) => (
                    <FormItem className="grid gap-1 pt-5">
                      <FormLabel>Hastane Adres*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Cumhuriyet Mah. Gürpınar Yolu Cad. No:5/A Kaya Millenium İş Merkezi Kat:8, D:147, 34500 Büyükçekmece/İstanbul"
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4 pt-10">
                  <FormField
                    control={form.control}
                    name="user_name"
                    render={({ field }) => (
                      <FormItem className="grid gap-1 ">
                        <FormLabel>Yetkili Adı*</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Alper" type="text" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="user_surname"
                    render={({ field }) => (
                      <FormItem className="grid gap-1 ">
                        <FormLabel>Yetkili Soyadı*</FormLabel>
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
                        <FormLabel>Yetkili TC Kimlik Numarası*</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="11111111111"
                            type="text"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-5 pb-5">
                  <FormField
                    control={form.control}
                    name="user_email"
                    render={({ field }) => (
                      <FormItem className="grid gap-1 ">
                        <FormLabel>Yetkili E-Posta Adresi*</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="example@acmeitsupport.com"
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
                        <FormLabel>Yetkili Telefon Numarası*</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="5301146058"
                            type="text"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="user_password"
                    render={({ field }) => (
                      <FormItem className="grid gap-1 ">
                        <FormLabel>Yetkili Şifresi*</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="********"
                            required
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Devam Et &rarr;
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-center text-sm">
            Giriş yapmak için{" "}
            <Link href="/" className="underline">
              Buraya tıkla
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
