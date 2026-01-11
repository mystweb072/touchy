import { createClient } from "@/lib/supabase/server";
import React from "react";
import Invitations from "./_components/Invitations";
import NotAuthorized from "../../_components/NotAuthorized";

type Props = {};

export default async function page({}: Props) {
  const supabase = await createClient();
  const { data: getUserAuth } = await supabase.auth.getUser();
  const user = getUserAuth.user?.id;
  if (!user) return <NotAuthorized />;

  const { data: getUserProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user)
    .single();

  const { data: getInvites } = await supabase
    .from("invitations")
    .select(
      `*,
              sender:from_user (
                first_name,
                last_name,
                user_id,
                created_at,
                avatar_url
              )`,
    )
    .match({
      to_user: user,
      status: "pending",
    });

  return (
    <div className="p-8">
      <Invitations getUserProfile={getUserProfile} getInvites={getInvites} />
    </div>
  );
}
