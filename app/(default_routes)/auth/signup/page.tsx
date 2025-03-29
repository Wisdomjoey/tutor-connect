"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { RegisterSchema, UseRegisterSchema } from "@/zod/schema";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import DefaultInput from "@/components/inputs/DefaultInput";
import SelectInput from "@/components/inputs/SelectInput";
import Spinner from "@/components/widgets/Spinner";
import { register } from "@/actions/user";

export default function SignUp() {
  const { toast } = useToast();
  const [isPending, transition] = useTransition();
  const form = useForm<UseRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      department: "",
      cPassword: "",
      password: "",
      fullname: "",
      faculty: "",
      matric: "",
      phone: "",
      email: "",
    },
  });

  const handleSubmit = (values: UseRegisterSchema) => {
    transition(async () => {
      const { message, success } = await register(values);

      if (success) form.reset();

      toast({
        description: message,
        variant: success ? "default" : "destructive",
      });
    });
  };

  return (
    <div className="container max-w-md mx-auto py-16">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-8"
          >
            <div className="space-y-4">
              <FormField
                name="fullname"
                disabled={isPending}
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <DefaultInput
                        id="fullname"
                        label="fullname"
                        autoComplete="name"
                        disabled={isPending}
                        placeholder="John Doe"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

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
                        placeholder="Email"
                        autoComplete="email"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                name="phone"
                disabled={isPending}
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <DefaultInput
                        type="tel"
                        id="phone"
                        label="Phone"
                        autoComplete="tel"
                        disabled={isPending}
                        placeholder="+2348049528543"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                name="faculty"
                disabled={isPending}
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <SelectInput
                        id="faculty"
                        label="Faculty"
                        disabled={isPending}
                        placeholder="Select Faculty"
                        items={[
                          { label: "Art", value: "Art" },
                          { label: "Business", value: "Business" },
                          { label: "Science", value: "Science" },
                        ]}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                name="department"
                disabled={isPending}
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <SelectInput
                        id="department"
                        label="Department"
                        disabled={isPending}
                        placeholder="Select Department"
                        items={[
                          { label: "Art", value: "Art" },
                          { label: "Business", value: "Business" },
                          { label: "Science", value: "Science" },
                        ]}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                name="matric"
                disabled={isPending}
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <DefaultInput
                        id="matric"
                        disabled={isPending}
                        label="Matric/Reg No."
                        placeholder="Matric No."
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
                        autoComplete="new-password"
                        type="password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                name="cPassword"
                disabled={isPending}
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <DefaultInput
                        id="cPassword"
                        disabled={isPending}
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        autoComplete="new-password"
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
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
