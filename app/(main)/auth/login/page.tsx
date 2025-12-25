"use client";
import { createClient } from "@/lib/supabase/client";
import React, { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { useRouter } from "next/navigation";
import OTPInput from "../register/_components/OTPInput";

type Props = {};

type Step = "EMAIL_SETUP" | "OTP_VERIFICATION";

export default function page({}: Props) {
  const [step, setStep] = useState<Step>("EMAIL_SETUP");
  const [email, setEmail] = useState("");
  const [OTPCode, setOTPCode] = useState("");

  const supabase = createClient();

  const handleEmailSet = async (event: React.FormEvent) => {
    event.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/register`,
      },
    });

    if (error) {
      console.log("Blad OTP", error.message);
      return;
    }

    setStep("OTP_VERIFICATION");
  };

  const handleOTPVerification = async (event: React.FormEvent) => {
    event.preventDefault();

    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: OTPCode,
      type: "email",
    });

    if (error) {
      console.log("Błąd", error.message);
      return;
    }
  };

  const renderSteps = () => {
    switch (step) {
      case "EMAIL_SETUP":
        return (
          <div className="flex justify-center items-center flex-col">
            <h1 className="font-bold text-3xl">Welcome back!</h1>
            <p className="text-2xl">Login in</p>
            <div className="py-6 w-full">
              <input
                type="text"
                className="px-3 py-2 text-xl outline-none border border-[#dedede] rounded-md w-full"
                placeholder="Enter your email here"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <button
              onClick={handleEmailSet}
              className="px-6 py-2 bg-black text-white rounded-lg cursor-pointer w-full"
            >
              Continue
            </button>
          </div>
        );
      case "OTP_VERIFICATION":
        return (
          <div className="">
            <div className="border-b border-[#dedede] pb-8">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-3xl border-[#dedede] border-2">
                  <MdOutlineEmail size={32} />
                </div>
                <div>
                  <h1 className="font-bold text-3xl">Check your email!</h1>
                  <p className="text-lg pt-1">
                    We've sent a code to{" "}
                    <span className="font-semibold">email</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="border-b border-[#dedede] pb-8">
              <OTPInput length={6} onComplete={setOTPCode} />
            </div>
            <div className="flex justify-between items-center pt-6">
              <button className="px-6 py-2 border-[#dedede] border rounded-lg cursor-pointer">
                Cos tu bedzie
              </button>
              <div className="flex gap-2 justify-end items-center">
                <button className="px-6 py-2 border-[#dedede] border rounded-lg cursor-pointer">
                  Resend code
                </button>
                <button
                  onClick={handleOTPVerification}
                  className="px-6 py-2 bg-linear-to-tr from-blue-700 to-blue-500 text-white border rounded-lg cursor-pointer"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="pt-24 flex justify-center items-center flex-col">
      {renderSteps()}
    </div>
  );
}
