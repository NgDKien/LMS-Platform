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

//         // Chỉ xử lý khi user thực sự được tạo mới
//         if (eventType === "user.created") {
//             console.log("👤 Processing user.created event");
//             const { id, email_addresses, first_name, last_name } = evt.data;

//             const email = email_addresses[0]?.email_address;
//             const name = `${first_name || ""} ${last_name || ""}`.trim();

//             console.log("User data:", { id, email, name });

//             try {
//                 // Kiểm tra xem user đã tồn tại trong Convex chưa
//                 const existingUser = await ctx.runQuery(api.users.getUser, {
//                     userId: id
//                 });

//                 if (existingUser) {
//                     console.log(`ℹ️ User ${id} already exists, skipping sync`);
//                     return new Response("User already exists", { status: 200 });
//                 }

//                 // Chỉ sync khi user chưa tồn tại
//                 console.log("🔄 Syncing new user to systems...");

//                 // Sync to Supabase
//                 await ctx.runAction(api.users.saveToSupabase, {
//                     clerkId: id,
//                     email,
//                     name,
//                 });
//                 console.log("✅ Saved to Supabase successfully");

//                 // Sync to Convex
//                 await ctx.runMutation(api.users.syncUser, {
//                     userId: id,
//                     email,
//                     name,
//                 });
//                 console.log("✅ Synced to Convex successfully");

//                 console.log(`🎉 New user ${id} synced to all systems`);
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

        // Chỉ xử lý khi user thực sự được tạo mới
        if (eventType === "user.created") {
            console.log("👤 Processing user.created event");
            const { id, email_addresses, first_name, last_name, image_url } = evt.data;

            const email = email_addresses[0]?.email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim();
            const image = image_url || null;

            console.log("User data:", { id, email, name, image });

            try {
                // Kiểm tra xem user đã tồn tại trong Convex chưa
                const existingUser = await ctx.runQuery(api.users.getUser, {
                    userId: id
                });

                if (existingUser) {
                    console.log(`ℹ️ User ${id} already exists, skipping sync`);
                    return new Response("User already exists", { status: 200 });
                }

                console.log("🔄 Syncing new user to all systems...");

                // 1. Sync to Supabase users table (bảng cũ)
                await ctx.runAction(api.users.saveToSupabase, {
                    clerkId: id,
                    email,
                    name,
                });
                console.log("✅ Saved to Supabase users table successfully");

                // 2. Sync to Supabase User_quiz table (bảng mới)
                await ctx.runAction(api.users.saveToSupabaseUserQuiz, {
                    clerkId: id,
                    email,
                    name,
                    image,
                });
                console.log("✅ Saved to Supabase User_quiz table successfully");

                // 3. Sync to Convex
                await ctx.runMutation(api.users.syncUser, {
                    userId: id,
                    email,
                    name,
                });
                console.log("✅ Synced to Convex successfully");

                console.log(`🎉 New user ${id} synced to all systems (users, User_quiz, convex)`);
            } catch (error) {
                console.error("❌ Error syncing user:", error);
                return new Response("Error syncing user", { status: 500 });
            }
        } else {
            console.log(`ℹ️ Ignoring event type: ${eventType}`);
        }

        console.log("✅ Webhook processed successfully");
        return new Response("Webhook processed successfully", { status: 200 });
    }),
});

export default http;