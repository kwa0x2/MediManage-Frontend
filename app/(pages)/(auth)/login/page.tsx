"use client";
import { Login } from "@/app/api/services/auth.Service";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const LoginPage = () => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      user_identifier: "",
      user_password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    console.log("Submitted values", values);

    const res = await Login(values);
    if (res.status == 200) {
      console.log(res);

    } else {
      console.warn("kayit olurken hata", res);
    }
  };

  return (
    <div className="w-full  h-screen flex justify-center">
      {/* <div className="shadow-2xl lg:col-span-2 bg-muted lg:block">
        <Image
          src="/office-stock.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-screen shadow-2xl w-auto object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div> */}
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Giriş Yap</h1>
            <p className="text-balance text-muted-foreground">
              Hesabınıza giriş yapmak için bilgilerinizi girin
            </p>
          </div>
          <div className="grid gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="user_identifier"
                  render={({ field }) => (
                    <FormItem className="grid gap-1">
                      <FormLabel>E-Posta veya Telefon Numarası*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="example@acmeitsupport.com or 1234567890"
                          type="text"
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* password */}
                <FormField
                  control={form.control}
                  name="user_password"
                  render={({ field }) => (
                    <FormItem className="grid gap-1 pt-5 pb-8">
                      <FormLabel>Şifre*</FormLabel>
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
                <Button type="submit" className="w-full">
                  Giriş Yap &rarr;
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-center text-sm">
            Hastane oluşturmak için {" "}
            <Link href="/register" className="underline">
              Buraya tıkla
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
