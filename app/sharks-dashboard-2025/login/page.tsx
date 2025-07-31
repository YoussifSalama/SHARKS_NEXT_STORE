"use client"

import { login } from "@/app/actions/auth/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "../features/Loader";

const Login = () => {
    const router = useRouter();
    const [loginLoading, setLoginLoading] = useState<boolean>(false);

    const form = useForm({
        defaultValues: {
            key: "",
            password: ""
        }
    })

    const handlogin = async (data: { key: string, password: string }) => {
        try {
            setLoginLoading(true);

            const result = await login(data);
            (result.ok) ? toast.dark(result.message) : toast.error(result.message);
            (result.ok && result.token) && Cookies.set("sharktoken", result.token, { expires: 1 }) && router.push("/sharks-dashboard-2025")
        }
        catch (error: any) { toast.error(error.message || "Something went wrong!") }
        finally { setLoginLoading(false) }
    }


    return (
        <section className="flex items-center justify-center flex-col h-dvh">
            <Label htmlFor="loginForm" className="mb-4">
                Admin Login
            </Label>
            <Form {...form}>
                <form id="loginForm" onSubmit={form.handleSubmit((data) => handlogin(data))} className=" shadow-md border p-4 rounded-md space-y-4">
                    <FormField
                        control={form.control}
                        name="key"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Key
                                </FormLabel>
                                <FormControl>
                                    <Input type="text" required placeholder="key (admin name) goes here!" className="min-w-[300px] max-w-[350px]" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input type="password" required placeholder="password goes here!" className="min-w-[300px] max-w-[350px]" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button className="w-full">
                        {
                            loginLoading ? <Loader classname={"w-6 h-6"} /> : "Login"
                        }
                    </Button>
                </form>
            </Form>
        </section >
    )
}
export default Login;