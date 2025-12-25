"use client";
import React, { useRef, useState } from "react";
import { BiCross, BiPlusCircle, BiSearch } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { sendInvitation } from "@/lib/actions";

type Props = {};

export default function InviteUserModal({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  let [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState<any>([]);
  const [isSent, seIsSent] = useState(false);
  const inviteCode = uuidv4();

  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyPressedDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  const openModal = () => {
    setIsOpen(true);
    window.addEventListener("keydown", handleKeyPressedDown);
    window.addEventListener("mousedown", handleClickOutside);
  };

  const closeModal = () => {
    setIsOpen(false);
    setUserInfo([]);
    setValue("");

    window.removeEventListener("keydown", handleKeyPressedDown);
    window.removeEventListener("mousedown", handleClickOutside);
  };

  const supabase = createClient();
  const handleFindUser = async () => {
    if (value.length === 0) return;
    value = value.trim();

    const { data: getUser, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("invite_code", value);

    if (error || !getUser || getUser.length === 0) {
      setError("Brak użytkownika");
      setUserInfo([]);
      return;
    }

    setError("");
    setUserInfo(getUser);
  };

  const handleSendInvitation = async () => {
    const { data: userAuth } = await supabase.auth.getUser();
    const user = userAuth.user?.id;
    if (!user) return <div>No sign in</div>;

    const { data: getUserProfile, error: userProfileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("invite_code", value)
      .maybeSingle();

    if (userProfileError) {
      setError("No profile has been found");
    }

    const { error } = await supabase.from("invitations").insert({
      invite_code: inviteCode,
      from_user: user,
      to_user: getUserProfile.user_id,
    });

    if (error) {
      setError(error.message);
      setUserInfo(null);
      return;
    }

    seIsSent(true);
  };

  return (
    <div>
      <button
        onClick={() => {
          isOpen ? closeModal() : openModal();
        }}
        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
      >
        <BiPlusCircle size={24} />
        New Connection
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 flex justify-center items-center bg-black/20">
            <motion.div
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: 20,
                opacity: 0,
              }}
              className="relative"
              ref={modalRef}
            >
              <button
                onClick={() => closeModal()}
                className="absolute right-4 top-4 border p-1 rounded-xl cursor-pointer"
              >
                <IoMdClose size={28} />
              </button>
              <div className="flex flex-col items-center justify-between p-8 rounded-2xl w-2xl h-176 bg-white">
                <div className="w-full">
                  <div className="flex flex-col items-center ">
                    <h2 className="text-3xl font-semibold">
                      Add New Connection
                    </h2>
                    <p className="text-lg max-w-96 text-center text-balance">
                      Search for a user and send them an invitation to connect.
                    </p>
                  </div>

                  <div className="relative flex items-center w-full pt-6">
                    <div className="absolute px-2">
                      <BiSearch size={24} />
                    </div>
                    <input
                      type="text"
                      className="w-full border p-2 pl-10 rounded-lg outline-none text-xl"
                      placeholder="Provide a unique user ID"
                      onChange={(event) => setValue(event.target.value)}
                      value={value}
                      min={1}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-4 pt-8">
                    {error && (
                      <div>
                        <p>{error}</p>
                      </div>
                    )}
                    {userInfo &&
                      userInfo.map((user: any, index: number) => {
                        const profileUrl = user.avatar_url
                          ? supabase.storage
                              .from("ProfilePictures")
                              .getPublicUrl(user.avatar_url).data.publicUrl
                          : "";

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-4">
                              {profileUrl && (
                                <Image
                                  src={profileUrl}
                                  alt="Profile Picture"
                                  width={50}
                                  height={50}
                                  className="rounded-full"
                                />
                              )}
                              <span className="text-xl">
                                {user.first_name} {user.last_name}
                              </span>
                            </div>

                            <motion.button
                              onClick={handleSendInvitation}
                              className={`${
                                isSent
                                  ? "from-green-700 to-green-500"
                                  : "from-blue-700 to-blue-500"
                              } bg-linear-to-tr px-6 py-2 rounded-xl text-md text-white cursor-pointer`}
                            >
                              {isSent ? "Sent" : "Invite"}
                            </motion.button>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <div className="flex w-full">
                  <button
                    onClick={handleFindUser}
                    className="bg-linear-to-tr from-blue-700 to-blue-500 px-8 py-3 rounded-xl text-xl text-white cursor-pointer w-full"
                  >
                    Find user
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
