// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { zodResolver } from "@hookform/resolvers/zod";
// import React from "react";
// import { useForm } from "react-hook-form";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { z } from "zod";
// import {io} from "socket.io-client";

// const LoginSchema = z.object({
//   message: z.string(),
//   room:z.string()
// });

// const socket = io("http://localhost:1337");

// export default function Page() {
//   const router = useRouter();
//   const form = useForm({
//     resolver: zodResolver(LoginSchema),
//     defaultValues: {
//       message:"",
//       room:"6"
//     },
//   });

//   const onSubmit = async (data: any) => {
//     console.log(data);


//     socket.emit("sendMessage", data);

//     socket.on("message", (message)=>{
//         console.log("message",message)
//     })
     
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
//         <FormField
//           control={form.control}
//           name="message"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Message</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit">Submit</Button>
//       </form>
//     </Form>
//   );
// }



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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { io } from "socket.io-client";

const LoginSchema = z.object({
  message: z.string(),
  room: z.string(),
});

const socket = io("http://localhost:1337");

export default function Page({params}:{params:{room:string}}) {

 const [messages, setMessages] = useState([]);

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      message: "",
      room: params.room,
    },
  });

  useEffect(() => {
    socket.emit("joinRoom", form.getValues("room"));

    socket.on("welcome", (message) => {
      console.log("welcome", message);
    });

    socket.on("message", (message) => {
      console.log("message", message);
    });

    

    return () => {
      socket.off("welcome");
      socket.off("message");
    };
  }, [form]);

  const onSubmit = async (data:any) => {
    console.log(data);
    socket.emit("sendMessage", data);
  };

  return (
    <Form {...form}>

        


      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
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
