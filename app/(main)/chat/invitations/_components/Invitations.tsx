"use client";
import { acceptInvitation, dismissInvitation } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { IoMdClose } from "react-icons/io";
import {
  IoArrowBack,
  IoArrowBackOutline,
  IoCalendarOutline,
  IoMailOpenOutline,
} from "react-icons/io5";

type Props = {
  getUserProfile: { first_name: string; last_name: string; user_id: string };
  getInvites:
    | {
        from_user: string;
        id: string;
        invite_code: string;
        created_at: string;
        sender: {
          user_id: string;
          first_name: string;
          last_name: string;
          avatar_url: string;
        };
      }[]
    | null;
};

export default function Invitations({ getUserProfile, getInvites }: Props) {
  const router = useRouter();
  const supabase = createClient();

  return (
    <div className="bg-slate-50 font-sans antialiased">
      <div className="fixed top-0 left-0 z-0 h-48 w-full bg-linear-to-br from-blue-700 to-blue-500 shadow-lg">
        <div className="relative z-10 px-6 pt-6 pb-12">
          <header className="mb-8 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center rounded-xl border border-white p-1 text-white transition-all active:scale-90"
            >
              <IoArrowBackOutline size={24} />
            </button>
            <h1 className="text-xl font-semibold text-white">Invites</h1>
            <div className="w-12"></div>
          </header>

          <div className="flex flex-col gap-5">
            {getInvites && getInvites.length > 0 ? (
              getInvites.map((invite, index) => {
                const { data: profilePicture } = supabase.storage
                  .from("ProfilePictures")
                  .getPublicUrl(invite.sender.avatar_url);

                return (
                  <motion.div
                    key={invite.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-4 flex items-center gap-4">
                      <div className="relative size-14 overflow-hidden rounded-2xl bg-slate-100 shadow-inner">
                        <Image
                          src={profilePicture.publicUrl}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg leading-tight font-bold text-slate-900">
                          {invite.sender.first_name} {invite.sender.last_name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <IoCalendarOutline size={14} />
                          <span className="text-xs font-medium tracking-wide uppercase">
                            {formatDate(invite.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="mb-6 text-sm leading-relaxed text-slate-600">
                      Has sent you a connection request. Once you accept, you'll
                      be able to exchange reactions and stay in touch.
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          dismissInvitation({ invite_code: invite.invite_code })
                        }
                        className="flex-1 cursor-pointer rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-600 transition-all active:scale-95 active:bg-red-50 active:text-red-600"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() =>
                          acceptInvitation({
                            invite_code: invite.invite_code,
                            sender_user_id: invite.sender.user_id,
                            recipient_user_id: getUserProfile.user_id,
                          })
                        }
                        className="flex-[1.5] cursor-pointer rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all active:scale-95 active:bg-blue-700"
                      >
                        Accept
                      </button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-20 flex flex-col items-center justify-center text-center"
              >
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-blue-500 shadow-xl shadow-blue-100">
                  <IoMailOpenOutline size={42} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  All clear!
                </h2>
                <p className="mt-2 max-w-[200px] text-slate-500">
                  You currently have no pending invitations.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
