"use client";

import {
  useLazyResendCodeQuery,
  useVerifyUserMutation,
} from "@/lib/features/auth/apiSlice";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

function Verify() {
  const [value, setValue] = useState(["", "", "", "", "", ""]);
  const router = useRouter();
  const search = useSearchParams();
  const userEmail = search.get("user-verify");
  const forgotEmail = search.get("forgot-verify");
  const [verify, { isLoading }] = useVerifyUserMutation();
  const [resendCode, { isLoading: sending }] = useLazyResendCodeQuery();
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  // handle value change
  const handleChange = (e, nextInputRef) => {
    const newValue = [...value];
    newValue[e.target.getAttribute("name")] = e.nativeEvent.data;
    setValue([...newValue]);
    nextInputRef.current.focus();
  };

  return (
    <div className="flex flex-col justify-center mt-5 px-5 lg:px-12 flex-1">
      <div className="text-center">
        <h3 className="text-2xl sm:text-4xl font-semibold text-dc-black mb-4">
          2-Step Verification
        </h3>
        <p className="text-base text-slate-700 leading-6">
          We sent a verification code to your email.
          <br />
          Enter the code from the email in the field below.
        </p>
      </div>

      <form
        className="mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          verify({
            redirect: (verifyToken) => {
              router.push(
                userEmail ? "/" : `/auth/reset-password?verified=${verifyToken}`
              );
            },
            resetForm: () => {
              setValue(["", "", "", "", "", ""]);
            },
            data: {
              email: userEmail || forgotEmail,
              verificationCode: value.join(""),
              verificationType: userEmail ? "createAccount" : "forgotAccount",
            },
          });
        }}
      >
        <div className="grid gap-4">
          <div className="flex justify-center mt-2">
            <div className="flex items-center space-x-2 md:space-x-8">
              <div>
                <input
                  type="number"
                  onChange={(e) => handleChange(e, ref2)}
                  ref={ref1}
                  name={0}
                  value={value?.[0]}
                  className="block p-4 text-dc-black focus:outline-none border-0 bg-slate-50 h-14 w-14 rounded-xl ring-1 ring-inset ring-slate-200 placeholder:text-gray-400 focus:ring-slate-500 sm:text-sm"
                />
              </div>
              <div>
                <input
                  type="number"
                  onChange={(e) => handleChange(e, ref3)}
                  ref={ref2}
                  name={1}
                  value={value?.[1]}
                  className="block p-4 text-dc-black focus:outline-none border-0 bg-slate-50 h-14 w-14 rounded-xl ring-1 ring-inset ring-slate-200 placeholder:text-gray-400 focus:ring-slate-500 sm:text-sm"
                />
              </div>
              <div>
                <input
                  type="number"
                  onChange={(e) => handleChange(e, ref4)}
                  ref={ref3}
                  name={2}
                  value={value?.[2]}
                  className="block p-4 text-dc-black focus:outline-none border-0 bg-slate-50 h-14 w-14 rounded-xl ring-1 ring-inset ring-slate-200 placeholder:text-gray-400 focus:ring-slate-500 sm:text-sm"
                />
              </div>
              <div>
                <input
                  type="number"
                  onChange={(e) => handleChange(e, ref5)}
                  ref={ref4}
                  name={3}
                  value={value?.[3]}
                  className="block p-4 text-dc-black focus:outline-none border-0 bg-slate-50 h-14 w-14 rounded-xl ring-1 ring-inset ring-slate-200 placeholder:text-gray-400 focus:ring-slate-500 sm:text-sm"
                />
              </div>
              <div>
                <input
                  type="number"
                  onChange={(e) => handleChange(e, ref6)}
                  ref={ref5}
                  name={4}
                  value={value?.[4]}
                  className="block p-4 text-dc-black focus:outline-none border-0 bg-slate-50 h-14 w-14 rounded-xl ring-1 ring-inset ring-slate-200 placeholder:text-gray-400 focus:ring-slate-500 sm:text-sm"
                />
              </div>
              <div>
                <input
                  type="number"
                  onChange={(e) => handleChange(e, ref1)}
                  ref={ref6}
                  name={5}
                  value={value?.[5]}
                  className="block p-4 text-dc-black focus:outline-none border-0 bg-slate-50 h-14 w-14 rounded-xl ring-1 ring-inset ring-slate-200 placeholder:text-gray-400 focus:ring-slate-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div className="">
            <p className="text-center text-base leading-6 text-slate-700 mt-4">
              I Didn't find{" "}
              <button
                type="button"
                onClick={() => resendCode({ email: userEmail || forgotEmail })}
                className="font-semibold text-green-500 hover:text-blue-600"
              >
                Send again
              </button>
            </p>
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
        <Link
          href="/login"
          className="font-semibold text-green-500 hover:text-blue-600"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default Verify;
