"use client";
import { apiSlice } from "../apiSlice/apiSlice";
import socket from "../socket/socket";
// Import the socket instance

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessages: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append("chatId", data.chatId);
        formData.append("content", data.content);
        if (data.files.length > 0) {
          data.files.map((file, i) => {
            formData.append(`files[${i}]`, file);
          });
        }

        return {
          url: `messages`,
          method: "POST",
          body: formData,
        };
      },
      async onQueryStarted(info, { queryFulfilled, dispatch }) {
        try {
          const { data, meta } = await queryFulfilled;
          if (meta.response.status === 200) {
            // handle successful post if needed
            socket.emit("new message", data);
          }
        } catch ({ error }) {
          // handle error
        }
      },
    }),

    getMessages: builder.query({
      query: ({ id }) => ({
        url: `/messages/${id}`,
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      // Listen for socket events and update query data
      onCacheEntryAdded: async (
        arg,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        try {
          await cacheDataLoaded;
          socket.on("message received socket", (newMessage) => {
            updateCachedData((draft) => {
              draft.push(newMessage); // Add new message to the existing messages array
            });
          });
        } catch (error) {
          console.error("Error in socket connection:", error);
        }

        // Cleanup the socket listener when cache entry is removed
        await cacheEntryRemoved;
        socket.off("newMessage");
      },
    }),
  }),
});

export const { useLazyGetMessagesQuery, useSendMessagesMutation } = messagesApi;
