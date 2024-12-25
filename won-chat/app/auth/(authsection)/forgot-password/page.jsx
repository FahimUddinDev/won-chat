"use client";
import { useLazyResendCodeQuery } from "@/lib/features/auth/apiSlice";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
const forgotSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

function ForgotPassword() {
  const router = useRouter();
  const [resendCode, { isLoading }] = useLazyResendCodeQuery();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotSchema,
    onSubmit: (values) => {
      resendCode({
        redirect: () =>
          router.push(`/auth/verify?forgot-verify=${values.email}`),
        resetForm: formik.resetForm,
        email: values.email,
      });
    },
  });
  return (
    <div className="flex flex-col justify-center mt-5 px-5 lg:px-12 flex-1">
      <div className="text-center">
        <h3 className="text-2xl sm:text-4xl font-semibold text-dc-black mb-4">
          Forgot Password
        </h3>
        <p className="text-base text-slate-700 leading-6">
          Welcome back, you’ve been missed!
        </p>
      </div>

      <form className="mt-4" action={formik.handleSubmit}>
        <div className="grid gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-dc-black"
            >
              Email
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
                  <rect
                    x="1.66797"
                    y="2.5"
                    width="16.6667"
                    height="15"
                    rx="4"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M1.66797 5.83325L7.50252 10.5009C8.9634 11.6696 11.0392 11.6696 12.5001 10.5009L18.3346 5.83325"
                    stroke="#475569"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="email"
                id="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="bg-slate-50 block w-full rounded-xl border-0 p-4 pl-10 text-dc-black ring-1 ring-inset ring-slate-200 placeholder:text-gray-400 focus:ring-1 focus:ring-slate-400 focus:outline-none sm:text-sm transition-all duration-300"
                placeholder="Your Email"
              />
              {formik.touched.email && formik.errors.email ? (
                <div>{formik.errors.email}</div>
              ) : null}
            </div>
          </div>

          <div>
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
        <Link
          href="/auth/login"
          className="font-semibold text-green-500 hover:text-blue-600"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
