"use client";
import { store } from "@/lib/store";
import { io } from "socket.io-client";

const userId = store?.getState()?.auth?.id;
let socket;
if (userId) {
  socket = io("http://localhost:3002", {
    query: { userId }, // Pass the user ID here
  }); // Add your server URL
}

export default socket;
