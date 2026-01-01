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
                isPro: true,
                // createdAt: Date.now(),
            });
        } else {
            console.log(`User ${args.userId} already exists in Convex, skipping insert`);
        }
    },
});

// Bảng users cũ
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

        const cleanUrl = supabaseUrl.replace(/\/$/, '');
        const endpoint = `${cleanUrl}/rest/v1/users`;

        console.log("Attempting to save user to Supabase users table:", {
            clerk_id: args.clerkId,
            email: args.email,
            name: args.name,
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
                    console.log(`User ${args.clerkId} already exists in Supabase users table, skipping insert`);
                    return;
                }
            }

            // Insert user vào bảng users
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

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Supabase users table error:", errorText);

                if (response.status === 409) {
                    console.log("User already exists in users table (409 conflict)");
                    return;
                }

                throw new Error(`Failed to save user to Supabase users table: ${response.status} - ${errorText}`);
            }

            console.log(`User ${args.clerkId} saved to Supabase users table successfully`);
        } catch (error) {
            console.error("Error in saveToSupabase (users table):", error);
            throw error;
        }
    },
});

// Bảng User_quiz mới
export const saveToSupabaseUserQuiz = action({
    args: {
        clerkId: v.string(),
        email: v.string(),
        name: v.string(),
        image: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error("Missing Supabase environment variables");
        }

        const cleanUrl = supabaseUrl.replace(/\/$/, '');
        const endpoint = `${cleanUrl}/rest/v1/User_quiz`;

        console.log("Attempting to save user to Supabase User_quiz table:", {
            id: args.clerkId,
            email: args.email,
            name: args.name,
            image: args.image,
        });

        try {
            // Kiểm tra xem user đã tồn tại chưa trong User_quiz table
            const checkResponse = await fetch(`${endpoint}?id=eq.${args.clerkId}&select=id`, {
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
                    console.log(`User ${args.clerkId} already exists in User_quiz table, skipping insert`);
                    return;
                }
            }

            // Insert user vào bảng User_quiz
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseKey}`,
                    'apikey': supabaseKey,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    id: args.clerkId, // Clerk user ID làm primary key
                    name: args.name,
                    email: args.email,
                    image: args.image || null,
                    emailVerified: null, // Có thể update sau
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Supabase User_quiz table error:", errorText);

                if (response.status === 409) {
                    console.log("User already exists in User_quiz table (409 conflict)");
                    return;
                }

                throw new Error(`Failed to save user to User_quiz table: ${response.status} - ${errorText}`);
            }

            console.log(`User ${args.clerkId} saved to User_quiz table successfully`);
        } catch (error) {
            console.error("Error in saveToSupabaseUserQuiz:", error);
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