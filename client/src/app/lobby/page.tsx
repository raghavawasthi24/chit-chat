"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import io from "socket.io-client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
// import { forgotPasswordAction } from "@/actions/Auth/auth";
// import toast from "react-hot-toast";

const CreateRoomSchema = z.object({
  group_name: z.string(),
  owner_id:z.string()
});

const JoinRoomSchema = z.object({
  group_id: z.string(),
});

const socket = io("http://localhost:1337");

export default function Page() {
  const router = useRouter();
  const createform = useForm<z.infer<typeof CreateRoomSchema>>({
    resolver: zodResolver(CreateRoomSchema),
    defaultValues: {
      group_name: "",
      owner_id: localStorage.getItem("id") || "2"
    },
  });

   const joinform = useForm<z.infer<typeof JoinRoomSchema>>({
     resolver: zodResolver(JoinRoomSchema),
     defaultValues: {
       group_id: ""
     },
   });

  async function onSubmit(data: z.infer<typeof CreateRoomSchema>) {
    try{
      const res = await fetch("http://localhost:1337/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: data
        }),
      });
      let resp= await res.json();
      router.push(`/${resp.data.id}`);
      }
    catch(error){
       console.log(error);
    }
  }

  async function joinSubmit(data: z.infer<typeof JoinRoomSchema>) {
    router.push(`/${data.group_id}`);
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-8">
      <Form {...createform}>
        <form
          onSubmit={createform.handleSubmit(onSubmit)}
          className="w-[500px] flex flex-col gap-8 justify-center items-center"
        >
          <FormField
            control={createform.control}
            name="group_name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-semibold text-xl">
                  Room Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter room name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </Form>

      <p className="text-sm">------------or------------</p>

      <Form {...joinform}> 
        <form
          onSubmit={joinform.handleSubmit(joinSubmit)}
          className="w-[500px] flex flex-col gap-8 justify-center items-center"
        >
          <FormField
            control={joinform.control}
            name="group_id"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-semibold text-xl">Room Id</FormLabel>
                <FormControl>
                  <Input placeholder="Enter room ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Join
          </Button>
        </form>
      </Form>
    </div>
  );
}
