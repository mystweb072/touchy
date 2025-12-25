import { createClient } from "@/lib/supabase/server";
import UnderConstruction from "@/app/(main)/_components/UnderConstruction";

type Props = {
  params: Promise<{ roomId: string }>;
};

export default async function page({ params }: Props) {
  const { roomId } = await params;
  const supabase = await createClient();
  const { data: userAuth } = await supabase.auth.getUser();
  const user = userAuth.user?.id;
  if (!user) return <div>No user</div>;

  const { data: roomData, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("connection_id", roomId)
    .single();

  if (roomError) {
    return <div>Room not found</div>;
  }

  const { data: connectionData, error: connectionError } = await supabase
    .from("connections")
    .select(
      `*,
        recipient:recipient_user_id (
            first_name,
            last_name,
            avatar_url
        ),
        sender:sender_user_id (
            first_name,
            last_name,
            avatar_url
        )`,
    )
    .eq("id", roomData?.connection_id)
    .single();

  if (connectionError) {
    return <div>Connection not found</div>;
  }

  return <UnderConstruction />;
}
