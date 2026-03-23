"use client";
import React, { useEffect, useState } from "react";
import Logo from "./_components/Logo";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {};

export default function Page({}: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = async () => {
    setIsLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      router.push("/chat");
    } else {
      router.push("/auth/register");
    }

    setIsLoading(false);
  };

  return (
    <div className="px-4 py-24 text-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="pb-6 text-4xl font-semibold">
          Lovely Touch - A quiet space for{" "}
          <span className="bg-linear-to-tr from-blue-700 to-blue-500 bg-clip-text text-transparent">
            heartfelt connection
          </span>
        </h1>

        <p className="max-w-2xl text-2xl">
          Express your love with tiny gestures and meaningful signals. Stay
          close, stay warm, and let every moment between you feel beautifully
          soft and personal
        </p>

        <div className="pt-24">
          <button
            onClick={() => router.push("/auth/register")}
            disabled={isLoading}
            className="rounded-xl bg-linear-to-tr from-blue-700 to-blue-500 px-12 py-4 text-3xl text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Checking..." : "Get started"}
          </button>
        </div>

        <button
          onClick={() => router.push("/chat")}
          className="mt-8 text-sm text-blue-500 opacity-50 transition-opacity hover:opacity-100"
        >
          Quick Chat Access (Test)
        </button>
      </div>
    </div>
  );
}
