"use server";

import { createClient } from "./supabase/server";

export async function createAccountForUser({
  email,
  first_name,
  password,
  last_name,
}: {
  email: string;
  first_name: string;
  password: string;
  last_name: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data) {
    throw new Error("Error creating user: " + error?.message);
  }

  await supabase.from("profiles").insert({
    user_id: data.user?.id,
    first_name,
    last_name,
  });
}

export const logOutUser = async () => {
  const supabase = await createClient();

  await supabase.auth.signOut();
};

export const logIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const supabase = await createClient();

  await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const getUserToInvite = async ({ user_id_b }: { user_id_b: string }) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user_id_b)
    .single();

  if (error || !data) {
    throw new Error("Error fetching user to invite: " + error?.message);
  }
};

export const sendInvitation = async ({
  from_user,
  to_user,
}: {
  from_user: string;
  to_user: string;
}) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("invitations").insert({
    from_user,
    to_user,
    invite_code: from_user,
    status: "pending",
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const acceptInvitation = async ({
  invite_code,
  sender_user_id,
  recipient_user_id,
}: {
  invite_code: string;
  sender_user_id: string;
  recipient_user_id: string;
}) => {
  const supabase = await createClient();

  const { data: insertedConnections, error: insertError } = await supabase
    .from("connections")
    .insert({
      sender_user_id,
      recipient_user_id,
    })
    .select()
    .single();

  if (insertError) {
    throw new Error("Nie udało się nawiązać połączenia");
  }

  const { data: updatedInvitation, error: updateError } = await supabase
    .from("invitations")
    .update({
      status: "accepted",
      is_accepted: true,
    })
    .eq("invite_code", invite_code)
    .select()
    .single();

  if (updateError) {
    throw new Error("Nie udało się nawiązać połączenia");
  }

  const { data: roomInvite, error: roomInviteError } = await supabase
    .from("rooms")
    .insert({
      connection_id: insertedConnections.id,
    })
    .select()
    .single();

  if (roomInviteError) {
    throw new Error("Nie udało się nawiązać połączenia");
  }
};

export const dismissInvitation = async ({
  invite_code,
}: {
  invite_code: string;
}) => {
  const supabase = await createClient();
  const { data: updatedInvitation, error: updateError } = await supabase
    .from("invitations")
    .update({
      status: "dismissed",
      is_accepted: false,
    })
    .eq("invite_code", invite_code);

  if (updateError) {
    throw new Error("Nie udało się nawiązać połączenia");
  }
};

export const sendReaction = async ({
  room_id,
  sender_id,
  recipient_id,
  type,
}: {
  room_id: string;
  sender_id: string;
  recipient_id: string;
  type: string;
}) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("reactions").insert({
    room_id,
    sender_id,
    recipient_id,
    type,
  });

  if (error) {
    throw new Error(error.message);
  }
};
