"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema, UseLoginSchema } from "@/zod/schema";
import { useForm } from "react-hook-form";
import DefaultInput from "@/components/inputs/DefaultInput";
import Spinner from "@/components/widgets/Spinner";
import { login } from "@/actions/auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const { toast } = useToast();
  const { update } = useSession();
  const [isPending, transition] = useTransition();
  const form = useForm<UseLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: UseLoginSchema) => {
    transition(async () => {
      const { message, success } = await login(values);

      if (success) await update();

      router.refresh();

      toast({
        description: message,
        variant: success ? "default" : "destructive",
      });
    });
  };

  return (
    <div className="container max-w-md mx-auto py-16">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-8"
          >
            <div className="space-y-4">
              <FormField
                name="email"
                disabled={isPending}
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <DefaultInput
                        id="email"
                        type="email"
                        label="Email"
                        disabled={isPending}
                        autoComplete="email"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                disabled={isPending}
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <DefaultInput
                        id="password"
                        label="Password"
                        disabled={isPending}
                        placeholder="Password"
                        autoComplete="current-password"
                        type="password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Spinner width="w-6" className="size-fit" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center mt-4 text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
