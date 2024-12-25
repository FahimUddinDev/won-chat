"use client";
import { apiSlice } from "../apiSlice/apiSlice";
import { userLoggedIn } from "../auth/authSlice";
// import socket from "../socket/socket";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    refreshAuth: builder.mutation({
      query: (data) => {
        return {
          url: `user/refresh`,
          method: "POST",
          body: data,
        };
      },
      // handle after actions
      async onQueryStarted(info, { queryFulfilled, dispatch }) {
        try {
          const { data, meta } = await queryFulfilled;
          if (meta.response.status === 200) {
            dispatch(userLoggedIn(data));
          }
        } catch ({ error }) {
          dispatch(
            userLoggedIn({
              email: undefined,
              firstName: undefined,
              id: undefined,
              lastName: undefined,
              refreshToken: undefined,
              token: undefined,
            })
          );
        }
      },
    }),
    getChats: builder.query({
      query: () => ({
        url: `/chats`,
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Listen for socket events and update query data
      onCacheEntryAdded: async (
        arg,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        try {
          await cacheDataLoaded;

          socket.on("message received socket", (newMessage) => {
            console.log("call");
            // updateCachedData((draft) => {
            //   draft.push(newMessage); // Add new message to the existing messages array
            // });
          });
        } catch (error) {
          console.error("Error in socket connection:", error);
        }

        // Cleanup the socket listener when cache entry is removed
        await cacheEntryRemoved;
        socket.off("newMessage");
      },
    }),
    accessChat: builder.mutation({
      query: (userId) => {
        return {
          url: `chats`,
          method: "POST",
          body: { userId },
        };
      },
    }),
  }),
});

export const { useGetChatsQuery, useAccessChatMutation } = chatApi;
