import { createClient } from "@/lib/supabase/server";
import UnderConstruction from "../../_components/UnderConstruction";

type Props = {};

export default async function page({}: Props) {
  const supabase = await createClient();
  const { data: userAuth } = await supabase.auth.getUser();
  const user = userAuth.user?.id;
  if (!user) return <div>No user</div>;

  return <UnderConstruction />;
}
