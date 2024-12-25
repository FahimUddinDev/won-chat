"use client";
import { toast } from "react-toastify";
import { apiSlice } from "../apiSlice/apiSlice";
import { userLoggedIn } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAccount: builder.mutation({
      query: ({ redirect, resetForm, data }) => {
        return {
          url: `/user/signup`,
          method: "POST",
          body: data,
        };
      },
      // handle after actions
      async onQueryStarted(info, { queryFulfilled, dispatch }) {
        // create loading toast
        const id = toast.loading("Please Wait...", {
          position: "top-right",
          closeButton: true,
        });
        try {
          const { data, meta } = await queryFulfilled;
          if (meta.response.status === 201) {
            // update toast on success
            toast.update(id, {
              render: `${data.message}`,
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
          }
          // reset form
          info.resetForm();
          // redirect to verify page
          info.redirect(data.email);
        } catch ({ error }) {
          // error show massage on toast
          toast.update(id, {
            render: `${error.data.message}`,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      },
    }),
    verifyUser: builder.mutation({
      query: ({ redirect, resetForm, data }) => {
        return {
          url: `/user/verify`,
          method: "POST",
          body: data,
        };
      },
      // handle after actions
      async onQueryStarted(info, { queryFulfilled, dispatch }) {
        // create loading toast
        const id = toast.loading("Please Wait...", {
          position: "top-right",
          closeButton: true,
        });
        try {
          const { data, meta } = await queryFulfilled;
          if (meta.response.status === 200) {
            toast.update(id, {
              render: `${data.message}`,
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
            if (data?.info?.token) {
              dispatch(userLoggedIn(data.info));
            }
          }
          // reset form
          info.resetForm();
          // redirect to verify page
          info.redirect(data?.info?.verificationToken);
        } catch ({ error }) {
          // error show massage on toast
          toast.update(id, {
            render: `${error?.data?.message}`,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      },
    }),
    resendCode: builder.query({
      query: ({ email, redirect, resetForm }) => ({
        url: `/user/sendVerificationCode/${email}`,
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      async onQueryStarted(info, { queryFulfilled, dispatch }) {
        // create loading toast
        const id = toast.loading("Please Wait...", {
          position: "top-right",
          closeButton: true,
        });
        try {
          const { data, meta } = await queryFulfilled;
          if (meta.response.status === 200) {
            toast.update(id, {
              render: `${data.message}`,
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
            info?.redirect();
            info?.resetForm();
          }
        } catch ({ error }) {
          toast.update(id, {
            render: `${error?.data?.message}`,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      },
    }),
    login: builder.mutation({
      query: ({ redirect, resetForm, data }) => {
        return {
          url: `/user/signin`,
          method: "POST",
          body: data,
        };
      },
      // handle after actions
      async onQueryStarted(info, { queryFulfilled, dispatch }) {
        // create loading toast
        const id = toast.loading("Please Wait...", {
          position: "top-right",
          closeButton: true,
        });
        try {
          const { data, meta } = await queryFulfilled;
          if (meta.response.status === 200) {
            toast.update(id, {
              render: `${data.message}`,
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
            dispatch(userLoggedIn(data.info));
          }
          // reset form
          info.resetForm();
          // redirect to verify page
          info.redirect();
        } catch ({ error }) {
          // error show massage on toast
          toast.update(id, {
            render: `${error.data.message}`,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      },
    }),
    resetPassword: builder.mutation({
      query: ({ redirect, resetForm, data }) => {
        return {
          url: `/user/reset-password`,
          method: "POST",
          body: data,
        };
      },
      // handle after actions
      async onQueryStarted(info, { queryFulfilled, dispatch }) {
        // create loading toast
        const id = toast.loading("Please Wait...", {
          position: "top-right",
          closeButton: true,
        });
        try {
          const { data, meta } = await queryFulfilled;
          if (meta.response.status === 200) {
            toast.update(id, {
              render: `${data.message}`,
              type: "success",
              isLoading: false,
              autoClose: 2000,
            });
          }
          // reset form
          info.resetForm();
          // redirect to verify page
          info.redirect();
        } catch ({ error }) {
          // error show massage on toast
          toast.update(id, {
            render: `${error.data.message}`,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      },
    }),
  }),
});

export const {
  useCreateAccountMutation,
  useVerifyUserMutation,
  useLazyResendCodeQuery,
  useLoginMutation,
  useResetPasswordMutation,
} = authApi;
