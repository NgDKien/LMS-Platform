import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";

export const syncUser = mutation({
    args: {
        userId: v.string(),
        email: v.string(),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .first();

        if (!existingUser) {
            console.log(`Creating new user in Convex: ${args.userId}`);
            await ctx.db.insert("users", {
                userId: args.userId,
                email: args.email,
                name: args.name,
                isPro: false,
                // createdAt: Date.now(),
            });
        } else {
            console.log(`User ${args.userId} already exists in Convex, skipping insert`);
        }
    },
});

// export const saveToSupabase = action({
//     args: {
//         clerkId: v.string(),
//         email: v.string(),
//         name: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//         const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

//         if (!supabaseUrl || !supabaseKey) {
//             throw new Error("Missing Supabase environment variables");
//         }

//         try {
//             const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${supabaseKey}`,
//                     'apikey': supabaseKey,
//                     'Prefer': 'return=minimal'
//                 },
//                 body: JSON.stringify({
//                     clerk_id: args.clerkId,
//                     email: args.email,
//                     name: args.name,
//                     provider: 'clerk',
//                     created_at: new Date().toISOString(),
//                     updated_at: new Date().toISOString()
//                 })
//             });

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 console.error("Supabase error:", errorText);
//                 throw new Error(`Failed to save user to Supabase: ${response.status}`);
//             }

//             console.log(`User ${args.clerkId} saved to Supabase successfully`);
//         } catch (error) {
//             console.error("Error saving to Supabase:", error);
//             throw error;
//         }
//     },
// });

export const saveToSupabase = action({
    args: {
        clerkId: v.string(),
        email: v.string(),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        console.log("Environment check:", {
            supabaseUrl: !!supabaseUrl,
            supabaseKey: !!supabaseKey
        });

        if (!supabaseUrl || !supabaseKey) {
            throw new Error("Missing Supabase environment variables");
        }

        // Remove trailing slash from URL if present
        const cleanUrl = supabaseUrl.replace(/\/$/, '');
        const endpoint = `${cleanUrl}/rest/v1/users`;

        console.log("Attempting to save user to Supabase:", {
            clerk_id: args.clerkId,
            email: args.email,
            name: args.name,
            endpoint
        });

        try {
            // Kiểm tra xem user đã tồn tại chưa
            const checkResponse = await fetch(`${endpoint}?clerk_id=eq.${args.clerkId}&select=clerk_id`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${supabaseKey}`,
                    'apikey': supabaseKey,
                    'Content-Type': 'application/json'
                }
            });

            if (checkResponse.ok) {
                const existingUsers = await checkResponse.json();

                if (existingUsers && existingUsers.length > 0) {
                    console.log(`User ${args.clerkId} already exists in Supabase, skipping insert`);
                    return;
                }
            }

            // Chỉ insert nếu user chưa tồn tại
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseKey}`,
                    'apikey': supabaseKey,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    clerk_id: args.clerkId,
                    email: args.email,
                    name: args.name,
                    provider: 'clerk',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
            });

            console.log("Supabase response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Supabase error details:", {
                    status: response.status,
                    statusText: response.statusText,
                    errorText
                });

                // Nếu conflict (409) có thể do race condition
                if (response.status === 409) {
                    console.log("User already exists (409 conflict), considering as success");
                    return;
                }

                throw new Error(`Failed to save user to Supabase: ${response.status} - ${errorText}`);
            }

            console.log(`User ${args.clerkId} saved to Supabase successfully`);
        } catch (error) {
            console.error("Error in saveToSupabase:", error);

            // Log more details about the error
            if (error instanceof TypeError && error.message.includes('fetch')) {
                console.error("Network error - check if Supabase URL is correct and accessible");
            }

            throw error;
        }
    },
});

// Test Supabase connection
export const testSupabaseConnection = action({
    args: {},
    handler: async (ctx) => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        console.log("Testing Supabase connection...");
        console.log("URL exists:", !!supabaseUrl);
        console.log("Key exists:", !!supabaseKey);

        if (!supabaseUrl || !supabaseKey) {
            throw new Error("Missing Supabase environment variables");
        }

        try {
            // Test với một simple SELECT query
            const response = await fetch(`${supabaseUrl}/rest/v1/users?limit=1`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${supabaseKey}`,
                    'apikey': supabaseKey,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Test response status:", response.status);

            if (response.ok) {
                const data = await response.text();
                console.log("Connection successful:", data);
                return { success: true, message: "Connection successful" };
            } else {
                const errorText = await response.text();
                console.error("Connection failed:", errorText);
                return { success: false, error: errorText };
            }
        } catch (error) {
            console.error("Connection test error:", error);
            throw error;
        }
    },
});

export const getUser = query({
    args: { userId: v.string() },

    handler: async (ctx, args) => {
        if (!args.userId) return null;

        const user = await ctx.db
            .query("users")
            .withIndex("by_user_id")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .first();

        if (!user) return null;

        return user;
    },
});

export const upgradeToPro = mutation({
    args: {
        email: v.string(),
        lemonSqueezyCustomerId: v.string(),
        lemonSqueezyOrderId: v.string(),
        amount: v.number(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();

        if (!user) throw new Error("User not found");

        await ctx.db.patch(user._id, {
            isPro: true,
            proSince: Date.now(),
            lemonSqueezyCustomerId: args.lemonSqueezyCustomerId,
            lemonSqueezyOrderId: args.lemonSqueezyOrderId,
        });

        return { success: true };
    },
});