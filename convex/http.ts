import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server"
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api, internal } from "./_generated/api";

const http = httpRouter();

http.route({
    path: "/lemon-squeezy-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const payloadString = await request.text();
        const signature = request.headers.get("X-Signature");

        if (!signature) {
            return new Response("Missing X-Signature header", { status: 400 });
        }

        try {
            const payload = await ctx.runAction(internal.lemonSqueezy.verifyWebhook, {
                payload: payloadString,
                signature,
            });

            if (payload.meta.event_name === "order_created") {
                const { data } = payload;

                const { success } = await ctx.runMutation(api.users.upgradeToPro, {
                    email: data.attributes.user_email,
                    lemonSqueezyCustomerId: data.attributes.customer_id.toString(),
                    lemonSqueezyOrderId: data.id,
                    amount: data.attributes.total,
                });

                if (success) {
                    // optionally do anything here
                }
            }

            return new Response("Webhook processed successfully", { status: 200 });
        } catch (error) {
            console.log("Webhook error:", error);
            return new Response("Error processing webhook", { status: 500 });
        }
    }),
});

// http.route({
//     path: "/clerk-webhook",
//     method: "POST",
//     handler: httpAction(async (ctx, request) => {
//         console.log("🚀 Webhook received!");

//         const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
//         console.log("Webhook secret exists:", !!webhookSecret);

//         if (!webhookSecret) {
//             console.error("❌ Missing CLERK_WEBHOOK_SECRET environment variable");
//             throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
//         }

//         const svix_id = request.headers.get("svix-id");
//         const svix_signature = request.headers.get("svix-signature");
//         const svix_timestamp = request.headers.get("svix-timestamp");

//         console.log("Headers:", {
//             svix_id: !!svix_id,
//             svix_signature: !!svix_signature,
//             svix_timestamp: !!svix_timestamp
//         });

//         if (!svix_id || !svix_signature || !svix_timestamp) {
//             console.error("❌ Missing svix headers");
//             return new Response("Error occurred -- no svix headers", {
//                 status: 400,
//             });
//         }

//         const payload = await request.json();
//         const body = JSON.stringify(payload);

//         console.log("📦 Payload received:", payload);

//         const wh = new Webhook(webhookSecret);
//         let evt: any;

//         try {
//             evt = wh.verify(body, {
//                 "svix-id": svix_id,
//                 "svix-timestamp": svix_timestamp,
//                 "svix-signature": svix_signature,
//             });
//             console.log("✅ Webhook verified successfully");
//         } catch (err) {
//             console.error("❌ Error verifying webhook:", err);
//             return new Response("Error occurred", { status: 400 });
//         }

//         const eventType = evt.type;
//         console.log("📋 Event type:", eventType);

//         if (eventType === "user.created") {
//             console.log("👤 Processing user.created event");
//             const { id, email_addresses, first_name, last_name } = evt.data;

//             const email = email_addresses[0]?.email_address;
//             const name = `${first_name || ""} ${last_name || ""}`.trim();

//             console.log("User data:", { id, email, name });

//             try {
//                 // Skip Supabase temporarily to isolate issue
//                 // console.log("💾 Saving to Supabase...");
//                 // await ctx.runAction(api.users.saveToSupabase, {
//                 //     clerkId: id,
//                 //     email,
//                 //     name,
//                 // });
//                 // console.log("✅ Saved to Supabase successfully");

//                 // Only test Convex first
//                 console.log("🔄 Syncing to Convex...");
//                 await ctx.runMutation(api.users.syncUser, {
//                     userId: id,
//                     email,
//                     name,
//                 });
//                 console.log("✅ Synced to Convex successfully");

//                 console.log(`🎉 User ${id} synced to Convex`);
//             } catch (error) {
//                 console.error("❌ Error syncing user:", error);
//                 return new Response("Error syncing user", { status: 500 });
//             }
//         } else {
//             console.log(`ℹ️ Ignoring event type: ${eventType}`);
//         }

//         console.log("✅ Webhook processed successfully");
//         return new Response("Webhook processed successfully", { status: 200 });
//     }),
// });

http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        console.log("🚀 Webhook received!");

        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        console.log("Webhook secret exists:", !!webhookSecret);

        if (!webhookSecret) {
            console.error("❌ Missing CLERK_WEBHOOK_SECRET environment variable");
            throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
        }

        const svix_id = request.headers.get("svix-id");
        const svix_signature = request.headers.get("svix-signature");
        const svix_timestamp = request.headers.get("svix-timestamp");

        console.log("Headers:", {
            svix_id: !!svix_id,
            svix_signature: !!svix_signature,
            svix_timestamp: !!svix_timestamp
        });

        if (!svix_id || !svix_signature || !svix_timestamp) {
            console.error("❌ Missing svix headers");
            return new Response("Error occurred -- no svix headers", {
                status: 400,
            });
        }

        const payload = await request.json();
        const body = JSON.stringify(payload);

        console.log("📦 Payload received:", payload);

        const wh = new Webhook(webhookSecret);
        let evt: any;

        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            });
            console.log("✅ Webhook verified successfully");
        } catch (err) {
            console.error("❌ Error verifying webhook:", err);
            return new Response("Error occurred", { status: 400 });
        }

        const eventType = evt.type;
        console.log("📋 Event type:", eventType);

        if (eventType === "user.created") {
            console.log("👤 Processing user.created event");
            const { id, email_addresses, first_name, last_name } = evt.data;

            const email = email_addresses[0]?.email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim();

            console.log("User data:", { id, email, name });

            // Separate error handling for each operation
            let supabaseSuccess = false;
            let convexSuccess = false;

            // Try saving to Supabase first
            try {
                console.log("💾 Saving to Supabase...");
                await ctx.runAction(api.users.saveToSupabase, {
                    clerkId: id,
                    email,
                    name,
                });
                console.log("✅ Saved to Supabase successfully");
                supabaseSuccess = true;
            } catch (supabaseError) {
                console.error("❌ Error saving to Supabase:", supabaseError);
                // Continue to try Convex even if Supabase fails
            }

            // Try syncing to Convex regardless of Supabase result
            try {
                console.log("🔄 Syncing to Convex...");
                await ctx.runMutation(api.users.syncUser, {
                    userId: id,
                    email,
                    name,
                });
                console.log("✅ Synced to Convex successfully");
                convexSuccess = true;
            } catch (convexError) {
                console.error("❌ Error syncing to Convex:", convexError);
            }

            // Report results
            if (supabaseSuccess && convexSuccess) {
                console.log(`🎉 User ${id} synced to both Supabase and Convex successfully`);
                return new Response("User synced successfully", { status: 200 });
            } else if (convexSuccess) {
                console.log(`⚠️ User ${id} synced to Convex only (Supabase failed)`);
                return new Response("User synced to Convex only", { status: 200 });
            } else if (supabaseSuccess) {
                console.log(`⚠️ User ${id} saved to Supabase only (Convex failed)`);
                return new Response("User saved to Supabase only", { status: 200 });
            } else {
                console.error(`❌ Failed to sync user ${id} to both systems`);
                return new Response("Error syncing user to both systems", { status: 500 });
            }

        } else {
            console.log(`ℹ️ Ignoring event type: ${eventType}`);
        }

        console.log("✅ Webhook processed successfully");
        return new Response("Webhook processed successfully", { status: 200 });
    }),
});

export default http;