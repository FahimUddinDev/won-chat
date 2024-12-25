"use client";
import { useLoginMutation } from "@/lib/features/auth/apiSlice";
import loginSchema from "@/schema/login";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Login() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      // Append values to the FormData object
      for (const key in values) {
        formData.append(key, values[key]);
      }
      login({
        redirect: (email) => router.push(`/`),
        resetForm: formik.resetForm,
        data: formData,
      });
    },
  });

  return (
    <div className="flex flex-col justify-center mt-5 px-5 lg:px-12 flex-1">
      <div className="text-center">
        <h3 className="text-2xl sm:text-4xl font-semibold text-dc-black mb-4">
          Sign In
        </h3>
        <p className="text-base text-slate-700 leading-6">
          Welcome back, you’ve been missed!
        </p>
      </div>
      <div className="mt-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          <a
            href="#"
            className="border border-slate-300 flex w-full items-center justify-center gap-3 rounded-lg p-4 text-slate-700 hover:border-green-500 transition-all duration-300"
          >
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_3367_29970)">
                <path
                  d="M4.93242 12.0863L4.23625 14.6852L1.69176 14.739C0.931328 13.3286 0.5 11.7149 0.5 10C0.5 8.34179 0.903281 6.77804 1.61812 5.40112H1.61867L3.88398 5.81644L4.87633 8.06815C4.66863 8.67366 4.55543 9.32366 4.55543 10C4.55551 10.7341 4.68848 11.4374 4.93242 12.0863Z"
                  fill="#2563EB"
                />
                <path
                  d="M20.3242 8.13184C20.439 8.73676 20.4989 9.36148 20.4989 9.99996C20.4989 10.7159 20.4236 11.4143 20.2802 12.0879C19.7934 14.3802 18.5214 16.3818 16.7594 17.7983L16.7588 17.7978L13.9055 17.6522L13.5017 15.1313C14.6709 14.4456 15.5847 13.3725 16.066 12.0879H10.7188V8.13184H16.144H20.3242Z"
                  fill="#2563EB"
                />
                <path
                  d="M16.7595 17.7977L16.7601 17.7983C15.0464 19.1757 12.8694 19.9999 10.4996 19.9999C6.69141 19.9999 3.38043 17.8713 1.69141 14.7389L4.93207 12.0862C5.77656 14.34 7.95074 15.9444 10.4996 15.9444C11.5952 15.9444 12.6216 15.6483 13.5024 15.1312L16.7595 17.7977Z"
                  fill="#28B446"
                />
                <path
                  d="M16.882 2.30219L13.6425 4.95437C12.7309 4.38461 11.6534 4.05547 10.4991 4.05547C7.89246 4.05547 5.67762 5.73348 4.87543 8.06812L1.61773 5.40109H1.61719C3.28148 2.1923 6.63422 0 10.4991 0C12.9254 0 15.1502 0.864297 16.882 2.30219Z"
                  fill="#F14336"
                />
              </g>
              <defs>
                <clipPath id="clip0_3367_29970">
                  <rect
                    width="20"
                    height="20"
                    fill="white"
                    transform="translate(0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
            <span className="text-base font-medium leading-6">
              {" "}
              Sign With Google{" "}
            </span>
          </a>
          <a
            href="#"
            className="border border-slate-300 flex w-full items-center justify-center gap-3 rounded-lg p-4 text-slate-700 hover:border-green-500 transition-all duration-300"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.8471 0C13.8936 0 13.9401 0 13.9893 0C14.1035 1.41044 13.5651 2.46432 12.9109 3.22751C12.2689 3.98542 11.3898 4.7205 9.9679 4.60897C9.87305 3.21872 10.4123 2.24301 11.0657 1.48158C11.6717 0.771967 12.7826 0.140517 13.8471 0Z"
                fill="currentColor"
              />
              <path
                d="M18.1529 14.6805C18.1529 14.6945 18.1529 14.7068 18.1529 14.72C17.7533 15.9302 17.1834 16.9674 16.4878 17.9299C15.8528 18.8038 15.0747 19.9797 13.6854 19.9797C12.4848 19.9797 11.6874 19.2078 10.457 19.1867C9.15543 19.1656 8.43967 19.8322 7.24967 19.9999C7.11354 19.9999 6.97742 19.9999 6.84392 19.9999C5.97008 19.8735 5.26486 19.1814 4.75109 18.5579C3.23614 16.7153 2.06546 14.3353 1.84766 11.2896C1.84766 10.991 1.84766 10.6933 1.84766 10.3947C1.93987 8.21493 2.99902 6.44266 4.40683 5.58374C5.14981 5.12706 6.1712 4.73801 7.30851 4.9119C7.79593 4.98742 8.29389 5.15429 8.73037 5.3194C9.14402 5.47836 9.66129 5.76027 10.1513 5.74534C10.4833 5.73568 10.8135 5.56267 11.1481 5.44059C12.1283 5.08667 13.089 4.68092 14.3555 4.8715C15.8774 5.10159 16.9577 5.77783 17.6251 6.82118C16.3376 7.64057 15.3197 8.87536 15.4936 10.984C15.6482 12.8994 16.7618 14.0201 18.1529 14.6805Z"
                fill="currentColor"
              />
            </svg>

            <span className="text-sm font-semibold leading-6">
              {" "}
              Sign With Apple{" "}
            </span>
          </a>
        </div>
        <div className="relative py-4">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm font-medium leading-6">
            <span className="bg-white uppercase px-6 text-gray-900">OR</span>
          </div>
        </div>
      </div>
      <form action={formik.handleSubmit}>
        <div className="grid gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-dc-black"
            >
              {" "}
              Email{" "}
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                id="email"
                className="bg-slate-50 block w-full rounded-xl border-0 p-4 pl-10 text-dc-black ring-1 ring-inset ring-slate-200 placeholder:text-gray-400 focus:ring-1 focus:ring-slate-400 focus:outline-none sm:text-sm transition-all duration-300"
                placeholder="Your Email"
              />
              {formik.touched.email && formik.errors.email ? (
                <div>{formik.errors.email}</div>
              ) : null}
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-dc-black"
            >
              {" "}
              Password{" "}
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
                placeholder="*****"
              />
              {formik.touched.password && formik.errors.password ? (
                <div>{formik.errors.password}</div>
              ) : null}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.rememberMe}
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-500 p-2"
              />
              <label
                htmlFor="remember-me"
                className="ml-3 block text-base text-slate-700"
              >
                {" "}
                Remember me{" "}
              </label>
            </div>
            <div className="text-sm leading-6">
              <Link
                href="/auth/forgot-password"
                className="font-semibold text-green-500 hover:text-blue-500 transition-all duration-300"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-xl bg-green-500 px-8 py-4 text-base font-medium leading-6 text-white hover:bg-green-600 transition-all duration-300"
            >
              Sign In
            </button>
          </div>
        </div>
      </form>
      <p className="text-center text-base leading-6 text-slate-700 mt-4">
        Don’t have an account yet?
        <Link
          href="/auth/create-account"
          className="font-semibold text-green-500 hover:text-blue-600 pl-2"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default Login;
