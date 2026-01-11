import { createClient } from "@/lib/supabase/server";
import UnderConstruction from "../../_components/UnderConstruction";
import NotAuthorized from "../../_components/NotAuthorized";

type Props = {};

export default async function page({}: Props) {
  const supabase = await createClient();
  const { data: userAuth } = await supabase.auth.getUser();
  const user = userAuth.user?.id;
  if (!user) return <NotAuthorized />;

  return <UnderConstruction />;
}
