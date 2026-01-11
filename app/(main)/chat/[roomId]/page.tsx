import { createClient } from "@/lib/supabase/server";
import MobileView from "./_components/views/MobileView";
import NotAuthorized from "../../_components/NotAuthorized";

type Props = {
  params: Promise<{ roomId: string }>;
};

export default async function page({ params }: Props) {
  const { roomId } = await params;
  const supabase = await createClient();

  const { data: authUser } = await supabase.auth.getUser();
  const user = authUser.user?.id;
  if (!user) return <NotAuthorized />;

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
            avatar_url,
            user_id
        ),
        sender:sender_user_id (
            first_name,
            last_name,
            avatar_url,
            user_id
        )`,
    )
    .eq("id", roomData?.connection_id)
    .single();

  if (connectionError) {
    return <div>Connection not found</div>;
  }

  const { data: reactionsData } = await supabase
    .from("reactions")
    .select(`*, sender:sender_id (*), recipient:recipient_id (*)`)
    .or(`sender_id.eq.${user},recipient_id.eq.${user}`)
    .eq("room_id", roomId)
    .order("created_at", { ascending: false });

  return (
    <div>
      <MobileView
        roomId={roomId}
        connection={connectionData}
        reactionsData={reactionsData}
        authUser={authUser.user}
      />
    </div>
  );
}
