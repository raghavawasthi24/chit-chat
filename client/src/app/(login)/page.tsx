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
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { LiaQuestionCircleSolid } from "react-icons/lia";
// import { loginAction } from "@/actions/Auth/auth";
// import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
// import { signIn } from "next-auth/react";
// import Cookies from "js-cookie";

const LoginSchema = z.object({
  email:z.string(),
  password:z.string()
})

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
   
    } catch (error: any) {
      console.log(JSON.parse(error));
    //   toast.error(error.message || "An error occurred");
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
                <Input {...field} />
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



// d105096675f2dee4231737694b78d8840f60e6a6ce723da941f395e18b2163dbebc65025d28b711355a24ef3c8ff1a74a52be76c306813ab22b32c56b030e5f40944496604cef3a35dab951f05a8734eaeddcb3ed8a14ef1d461c58f75f5e1383eedb3b14acf79a4f6d0bca1d7d57ba9b95e67de2b0b3ef27ef6b1850083f8cd;