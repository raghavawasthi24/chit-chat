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

      if(res){
         let resp= await res.json();
         socket.emit("joinRoom", resp.data.id);

         socket.on("welcome", (message) => {
           // Handle incoming messages
           console.log(message);
           router.push(`/${resp.data.id}`);
         });
      }
    }
    catch(error){
       console.log(error);
    }
  }

  async function joinSubmit(data: z.infer<typeof JoinRoomSchema>) {
    try {
        socket.emit("joinRoom", data.group_id);

        socket.on("welcome", (message) => {
          // Handle incoming messages
          console.log(message);
          router.push(`/${data.group_id}`);
        });

        // socket.off("welcome");
      
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Form {...createform}>
        <form
          onSubmit={createform.handleSubmit(onSubmit)}
          className="flex flex-col gap-8 justify-center items-center"
        >
          <FormField
            control={createform.control}
            name="group_name"
            render={({ field }) => (
              <FormItem className="w-1/3">
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
          <Button type="submit" className="w-1/3">
            Create
          </Button>
        </form>
      </Form>

      <p className="text-lg">------------or------------</p>

      <Form {...joinform}> 
        <form
          onSubmit={joinform.handleSubmit(joinSubmit)}
          className="flex flex-col gap-8 justify-center items-center"
        >
          <FormField
            control={joinform.control}
            name="group_id"
            render={({ field }) => (
              <FormItem className="w-1/3">
                <FormLabel className="font-semibold text-xl">Room Id</FormLabel>
                <FormControl>
                  <Input placeholder="Enter room ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-1/3">
            Join
          </Button>
        </form>
      </Form>
    </div>
  );
}
