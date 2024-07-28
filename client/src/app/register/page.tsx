"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

const LoginSchema = z.object({
  username:z.string(),
  email: z.string(),
  password: z.string(),
});

export default function Page() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username:"",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

      if (!res.ok) {
        throw new Error("Register failed");
      }

      const resData = await res.json();

      console.log(resData);

      if (resData) {
        router.push("/"); 
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-sceen h-screen flex flex-col gap-4 justify-center items-center">
      <p className="text-2xl font-bold">Sign Up</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 w-[500px]"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
        <p>
          Already have an account?
          <Link href="/" className="text-blue-500">
            Login
          </Link>
        </p>
      </Form>
    </div>
  );
}
