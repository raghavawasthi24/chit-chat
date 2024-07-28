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
  email: z.string(),
  password: z.string(),
});

export default function Page() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      const res = await fetch("http://localhost:1337/api/auth/local", {
        // Ensure the correct API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Make sure to include Content-Type header
        },
        body: JSON.stringify({
          identifier: "newu@example.com", // Use 'identifier' as required by Strapi
          password: "password",
        }),
      });

      //   const res = await fetch("http://localhost:1337/api/auth/local/register", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       username: "newuser",
      //       email: "newu@example.com",
      //       password: "password",
      //     }),
      //   });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const resData = await res.json();

      console.log(resData);

      if (resData.jwt) {
        localStorage.setItem("jwt", resData.jwt);
        localStorage.setItem("username", resData.user.username);
        localStorage.setItem("userId", resData.user.id); // Store the JWT token in local storage
        router.push("/lobby"); // Redirect user after successful login
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
    </Form>
  );
}
