"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import { CiUser } from "react-icons/ci";
import { nanoid } from "nanoid";

type Props = {};

export default function ProfileSetup({}: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const handleProfileSetup = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data } = await supabase.auth.getUser();
    const user = data.user?.id;

    const { error } = await supabase.from("profiles").insert({
      user_id: user,
      first_name: firstName,
      last_name: lastName,
      invite_code: nanoid(12),
      is_profile_completed: true,
    });

    if (error) {
      console.log("Blad!", error);
    }

    router.push("/chat");
  };

  return (
    <div className="w-75 sm:w-100 lg:w-150">
      <div className="border-b border-[#dedede] pb-8">
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <div className="rounded-3xl border-2 border-[#dedede] p-4">
            <CiUser size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Create your profile</h1>
            <p className="pt-1 text-center text-lg lg:text-left">
              Lorem ipsum dolor sit amet.
            </p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-8">
          <InputField
            id="first_name"
            title="First name"
            state={firstName}
            setState={setFirstName}
          />
          <InputField
            id="last_name"
            title="Last name"
            state={lastName}
            setState={setLastName}
          />
        </div>
        <div className="flex items-center justify-end gap-2 pt-12">
          <button
            onClick={handleProfileSetup}
            className="w-full cursor-pointer rounded-lg border bg-linear-to-tr from-blue-700 to-blue-500 px-6 py-2 text-white"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

const InputField = ({
  id,
  title,
  state,
  setState,
}: {
  id: string;
  title: string;
  state: string;
  setState: (event: string) => void;
}) => {
  return (
    <div className="flex flex-col justify-between gap-2 lg:flex-row lg:gap-16">
      <label className="text-2xl" htmlFor={id}>
        {title}
      </label>
      <div className="flex-1">
        <input
          type="text"
          className="w-full rounded-full border border-[#dedede] px-4 py-1 text-lg outline-none"
          placeholder={`Enter your ${title.toLowerCase()} here`}
          id={id}
          name={id}
          value={state}
          onChange={(event) => setState(event.target.value)}
        />
      </div>
    </div>
  );
};
