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
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { io } from "socket.io-client";
import MessageBox from "./components/MessageBox";
import ActiveUser from "./components/ActiiveUser";

const LoginSchema = z.object({
  message: z.string(),
  room: z.string(),
  username: z.string(),
  userId: z.string(),
});

interface Message {
  type: string;
  message: string;
  sender: string;
}

interface ActiveUser {
  username: string;
  userId: string;
}

const socket = io("http://localhost:1337");

export default function Page({ params }: { params: { room: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const isInitialMount = useRef(true);

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: localStorage.getItem("username") || "",
      message: "",
      room: params.room,
      userId: localStorage.getItem("userId") || "",
    },
  });

  useEffect(() => {
    if (isInitialMount.current) {
      const room = form.getValues("room");
      const username = form.getValues("username");
      const userId = form.getValues("userId");

      console.log("emitting");
      socket.emit("joinRoom", { room, username, userId });

      isInitialMount.current = false; // Set ref to false after first render
    }

    socket.on("welcome", (message) => {
      console.log("welcome", message);
    });

    socket.on("message", (message) => {
      console.log("message", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "receiver", message: message.text, sender: message.senderId },
      ]);
    });

    socket.on("activeUsers", (users: ActiveUser[]) => {
      setActiveUsers(users);
    });

    return () => {
      socket.off("welcome");
      socket.off("message");
      socket.off("activeUsers");
    };
  }, [form]);

  const onSubmit = async (data: any) => {
    console.log(data);

    try {
      const strapiData = {
        data: {
          username: data.username,
          roomId: data.room,
          userId: data.userId,
          message: data.message,
        },
      };

      console.log(strapiData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(strapiData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(`Server error: ${result.message}`);
      }

      socket.emit("sendMessage", data);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "sent",
          message: data.message,
          sender: localStorage.getItem("userId") || "NA",
        },
      ]);

      console.log(result);
    } catch (error: any) {
      console.error("Error sending message to Strapi API:", error.message);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <p className="p-4 bg-blue-500 text-white py-10 text-xl">
        Start chatting within the group
      </p>
      <div className="w-full h-full flex">
        <div className="w-1/3 p-4">
          <ActiveUser activeUsers={activeUsers} />
        </div>
        <div className="w-2/3 flex flex-col p-4">
          <div className="w-full flex flex-col flex-1">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`w-full flex ${
                  message.type === "receiver" ? "justify-start" : "justify-end"
                }`}
              >
                <MessageBox data={message} key={index} />
              </div>
            ))}
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="w-full">
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
    </div>
  );
}
