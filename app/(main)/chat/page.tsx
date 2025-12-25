import { createClient } from "@/lib/supabase/server";
import MobileView from "./_components/views/MobileView";

type Props = {};

export default async function page({}: Props) {
  const supabase = await createClient();
  const { data: userAuth } = await supabase.auth.getUser();
  const user = userAuth.user?.id;

  if (!user) return <div>No user</div>;

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

  const { data: getUserProfilePicture } = await supabase.storage
    .from("ProfilePictures")
    .getPublicUrl(getUserProfile.avatar_url);

  const { data: connections } = await supabase
    .from("connections")
    .select(
      `*,
      sender:sender_user_id (
        first_name,
        last_name,
        avatar_url
      ),
      recipient:recipient_user_id (
        first_name,
        last_name,
        avatar_url
      )`,
    )
    .or(`sender_user_id.eq.${user},recipient_user_id.eq.${user}`);

  if (!connections) return;

  return (
    <div>
      <div className="md:hidden">
        <MobileView
          connections={connections}
          userAuth={userAuth.user}
          getInvites={getInvites}
          publicUrl={getUserProfilePicture.publicUrl}
          getUserProfile={getUserProfile}
        />
      </div>
    </div>
  );
}
