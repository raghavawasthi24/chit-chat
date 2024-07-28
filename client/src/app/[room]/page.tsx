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
import MessageBox from "./components/MessageBox";
import ActiiveUser from "./components/ActiiveUser";

const LoginSchema = z.object({
  message: z.string(),
  room: z.string(),
});

interface Message {
  type: string;
  message: string;
  sender: string;
}

const socket = io("http://localhost:1337");

export default function Page({ params }: { params: { room: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);

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
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "receiver", message: message.text, sender: "other" },
      ]);
    });

    return () => {
      socket.off("welcome");
      socket.off("message");
    };
  }, [form]);

  const onSubmit = async (data: any) => {
    console.log(data);
    socket.emit("sendMessage", data);

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "sent", message: data.message, sender: "me" },
    ]);
  };

  return (
    <div className="w-full flex">
      <ActiiveUser />


      <div className="w-2/3">
        <div className="flex flex-col">
          {messages.map((message, index) => (
            <MessageBox data={message} />
          ))}
        </div>
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
      </div>
    </div>
  );
}
