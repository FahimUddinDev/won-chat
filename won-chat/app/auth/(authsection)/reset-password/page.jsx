"use client";
import { useResetPasswordMutation } from "@/lib/features/auth/apiSlice";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";

import * as Yup from "yup";
const resetSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*]/,
      "Password must contain at least one special character"
    ),

  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("verified");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      // Append values to the FormData object
      formData.append("newPassword", values.password);
      formData.append("verifyToken", token);
      resetPassword({
        redirect: () => router.push(`/`),
        resetForm: formik.resetForm,
        data: formData,
      });
    },
  });
  return (
    <div className="flex flex-col justify-center mt-5 px-5 lg:px-12 flex-1">
      <div className="text-center">
        <h3 className="text-2xl sm:text-4xl font-semibold text-dc-black mb-4">
          Create a new Password
        </h3>
        <p className="text-base text-slate-700 leading-6">
          Welcome back, you’ve been missed!
        </p>
      </div>

      <form className="mt-6" action={formik.handleSubmit}>
        <div className="grid gap-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-dc-black"
            >
              Password
            </label>
            <div className="relative mt-1.5 rounded-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_3367_30130)">
                    <rect
                      x="1.66797"
                      y="5"
                      width="16.6667"
                      height="13.3333"
                      rx="4"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    <ellipse
                      cx="9.9987"
                      cy="11.6667"
                      rx="1.66667"
                      ry="1.66667"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M13.3346 5.00008C13.3346 3.15913 11.8423 1.66675 10.0013 1.66675C8.16035 1.66675 6.66797 3.15913 6.66797 5.00008"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3367_30130">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <input
                type="text"
                name="password"
                id="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="bg-slate-50 block w-full rounded-xl border-0 p-4 pl-10 text-dc-black ring-1 ring-inset ring-slate-200 placeholder:text-gray-400 focus:ring-1 focus:ring-slate-400 focus:outline-none sm:text-sm transition-all duration-300"
                placeholder="Your Email"
              />
              {formik.touched.password && formik.errors.password ? (
                <div>{formik.errors.password}</div>
              ) : null}
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-dc-black"
            >
              Confirm Password
            </label>
            <div className="relative mt-1.5 rounded-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_3367_30130)">
                    <rect
                      x="1.66797"
                      y="5"
                      width="16.6667"
                      height="13.3333"
                      rx="4"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    <ellipse
                      cx="9.9987"
                      cy="11.6667"
                      rx="1.66667"
                      ry="1.66667"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M13.3346 5.00008C13.3346 3.15913 11.8423 1.66675 10.0013 1.66675C8.16035 1.66675 6.66797 3.15913 6.66797 5.00008"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3367_30130">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <input
                type="text"
                name="confirmPassword"
                id="confirmPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                className="bg-slate-50 block w-full rounded-xl border-0 p-4 pl-10 text-dc-black ring-1 ring-inset ring-slate-200 placeholder:text-gray-400 focus:ring-1 focus:ring-slate-400 focus:outline-none sm:text-sm transition-all duration-300"
                placeholder="********"
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div>{formik.errors.confirmPassword}</div>
              ) : null}
            </div>
          </div>

          <div className="mt-2">
            <button
              type="submit"
              className="flex w-full justify-center rounded-xl bg-green-500 px-8 py-4 text-base font-medium leading-6 text-white hover:bg-green-600 transition-all duration-300"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      <p className="text-center text-base leading-6 text-slate-700 mt-4">
        Back to
        <a
          href="#"
          className="font-semibold text-green-500 hover:text-blue-600"
        >
          Sign In
        </a>
      </p>
    </div>
  );
}

export default ResetPassword;
