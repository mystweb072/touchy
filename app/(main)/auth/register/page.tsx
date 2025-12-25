"use client";
import { createClient } from "@/lib/supabase/client";
import React, { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { useRouter } from "next/navigation";
import OTPInput from "./_components/OTPInput";
import ProfileSetup from "./_components/ProfileSetup";

type Props = {};

type Step = "EMAIL_SETUP" | "OTP_VERIFICATION" | "PROFILE_SETUP";

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
  const router = useRouter();
  const handleOTPVerification = async (event: React.FormEvent) => {
    event.preventDefault();

    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: OTPCode,
      type: "email",
    });

    if (error) {
      console.log("Błąd weryfikacji:", error.message);
      alert("Invalid code. Please try again.");
      return;
    }

    const userId = data.user?.id;
    if (!userId) return;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_profile_completed")
      .eq("user_id", userId)
      .single();

    if (profile?.is_profile_completed) {
      router.push("/chat");
    } else {
      setStep("PROFILE_SETUP");
    }
  };

  const renderSteps = () => {
    switch (step) {
      case "EMAIL_SETUP":
        return (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold md:text-3xl">
              Welcome to Touchy!
            </h1>
            <p className="text-center text-lg md:text-xl lg:text-2xl">
              To get started, create your account
            </p>
            <div className="w-full py-6">
              <input
                type="email"
                className="w-full rounded-md border border-[#dedede] px-3 py-2 text-xl outline-none"
                placeholder="Enter your email here"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <button
              onClick={handleEmailSet}
              className="w-full cursor-pointer rounded-lg bg-black px-6 py-2 text-white"
            >
              Continue
            </button>
          </div>
        );
      case "OTP_VERIFICATION":
        return (
          <div className="">
            <div className="border-b border-[#dedede] pb-8">
              <div className="flex flex-col items-center gap-4 lg:flex-row">
                <div className="rounded-3xl border-2 border-[#dedede] p-4">
                  <MdOutlineEmail size={32} />
                </div>
                <div>
                  <h1 className="text-center text-3xl font-bold lg:text-left">
                    Check your email!
                  </h1>
                  <p className="pt-1 text-center text-lg lg:text-left lg:text-xl">
                    We've sent a code to{" "}
                    <span className="font-semibold">{email}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="border-b border-[#dedede] pb-8">
              <OTPInput length={6} onComplete={setOTPCode} />
            </div>
            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={handleOTPVerification}
                  className="cursor-pointer rounded-lg border bg-linear-to-tr from-blue-700 to-blue-500 px-6 py-2 text-white"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>
        );
      case "PROFILE_SETUP":
        return <ProfileSetup />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-24">
      {renderSteps()}
    </div>
  );
}
