"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(_prevState: unknown, formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    });

    if (error) return { error: error.message };

    redirect("/");
}

export async function register(_prevState: unknown, formData: FormData) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        options: {
            data: {
                name: formData.get("name") as string,
                username: formData.get("username") as string,
            }
        }
    });

    if (error) return { error: error.message };

    redirect("/");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
}