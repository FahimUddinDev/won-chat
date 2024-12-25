"use client";
import { apiSlice } from "../apiSlice/apiSlice";
import socket from "../socket/socket";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ search }) => ({
        url: `/users?search=${search}`,
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,

      // Listen for socket events and update query data accordingly
      onCacheEntryAdded: async (
        arg,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved }
      ) => {
        try {
          await cacheDataLoaded;
          // Set up socket listeners for active and inactive users
          socket.on("active user", (userId) => {
            updateCachedData((draft) => {
              const users = JSON.parse(JSON.stringify(draft));
              const updatedData = users.users.map((user) => {
                if (user._id === userId) {
                  user.isActive = true;
                  return user;
                } else {
                  return user;
                }
              });
              // console.log(updatedData);
              return { users: [...updatedData] };
            });
          });
          socket?.on("inactive user", (userId) => {
            updateCachedData((draft) => {
              const users = JSON.parse(JSON.stringify(draft));
              const updatedData = users.users.map((user) => {
                if (user._id === userId) {
                  user.isActive = false;
                  return user;
                } else {
                  return user;
                }
              });
              return { users: [...updatedData] };
            });
          });
        } catch (error) {
          console.error("Error in socket connection:", error);
        }

        // Cleanup socket listeners when cache entry is removed
        await cacheEntryRemoved;
        socket?.off("active user");
        socket?.off("inactive user");
      },
    }),
  }),
});

export const { useLazyGetUsersQuery } = usersApi;
