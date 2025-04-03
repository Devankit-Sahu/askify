import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createUser, deleteUser, updateUser } from "@/app/actions";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  if (evt.type === "user.created") {
    const { id, username, email_addresses, image_url, external_accounts } =
      evt.data;

    if (!id || !email_addresses || !email_addresses[0].email_address) {
      return new Response("Missing required user data (email)", {
        status: 400,
      });
    }

    const oauthId = external_accounts[0].id;
    const oauthProvider = external_accounts[0].provider;

    const userData: Omit<
      User,
      | "createdAt"
      | "stripeCustomerId"
      | "stripeSubscriptionId"
      | "stripePriceId"
      | "stripeCurrentPeriodEnd"
    > = {
      id: id,
      imageUrl: image_url,
      email: email_addresses[0].email_address,
      username: username,
      oauthId,
      oauthProvider,
    };

    try {
      await createUser(userData);
      return NextResponse.json(
        { message: "User created successfully" },
        { status: 201 }
      );
    } catch (err) {
      console.error("Error creating user:", err);
      return new Response("Failed to create user", { status: 500 });
    }
  } else if (evt.type === "user.updated") {
    const { id, username, email_addresses, image_url } = evt.data;

    if (!id || !email_addresses || !email_addresses[0]?.email_address) {
      return new Response("Missing required user data (email)", {
        status: 400,
      });
    }

    const updatedUserData = {
      id,
      email: email_addresses[0].email_address,
      username,
      imageUrl: image_url,
    };

    try {
      //@ts-expect-error - The type of the function is not matching the type of the data
      await updateUser(updatedUserData);
      return NextResponse.json(
        { message: "User updated successfully" },
        { status: 200 }
      );
    } catch (err) {
      console.error("Error updating user:", err);
      return new Response("Failed to update user", { status: 500 });
    }
  } else if (evt.type === "user.deleted") {
    const { id } = evt.data;

    if (!id) {
      return new Response("Missing required user id", { status: 400 });
    }

    try {
      await deleteUser(id);
      return NextResponse.json(
        { message: "User deleted successfully" },
        { status: 200 }
      );
    } catch (err) {
      console.error("Error deleting user:", err);
      return new Response("Failed to delete user", { status: 500 });
    }
  } else {
    return new Response("Event type not handled", { status: 200 });
  }
}
