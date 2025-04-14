"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ClassSchema, UseClassSchema } from "@/zod/schema";
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
import DateInput from "@/components/inputs/DateInput";
import TextAreaInput from "@/components/inputs/TextAreaInput";
import { createClass } from "@/actions/class";

export default function CreateClass() {
  const { toast } = useToast();
  const [isPending, transition] = useTransition();
  const form = useForm<UseClassSchema>({
    resolver: zodResolver(ClassSchema),
    defaultValues: {
      description: "",
      department: "",
      duration: "",
      faculty: "",
      title: "",
      date: "",
      max: "",
    },
  });

  const handleSubmit = async (values: UseClassSchema) => {
    transition(async () => {
      const { message, success } = await createClass(values);

      if (success) form.reset();

      toast({
        description: message,
        variant: success ? "default" : "destructive",
      });
    });
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create a New Class</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-8"
          >
            <div className="space-y-4">
              <FormField
                name="title"
                disabled={isPending}
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <DefaultInput
                        id="title"
                        label="Title"
                        disabled={isPending}
                        placeholder="Enter class title or subject"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                disabled={isPending}
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <TextAreaInput
                        id="description"
                        label="Description"
                        placeholder="Enter class description"
                        disabled={isPending}
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
                        label="Faculty (optional)"
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
                        label="Department (optional)"
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
                name="date"
                disabled={isPending}
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <DefaultInput
                        {...field}
                        id="date"
                        label="Date"
                        disabled={isPending}
                        placeholder="Enter date of class"
                        type="datetime-local"
                        onChange={(e) => {
                          e.preventDefault();

                          field.onChange(new Date(e.target.value));
                        }}
                      />
                    </FormControl>

                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                name="duration"
                disabled={isPending}
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <DefaultInput
                        id="duration"
                        label="Duration"
                        disabled={isPending}
                        placeholder="Enter class duration in hours"
                        type="number"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                name="max"
                disabled={isPending}
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormControl>
                      <DefaultInput
                        id="max"
                        disabled={isPending}
                        label="Maximum students"
                        placeholder="Enter maximum students"
                        type="number"
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
                "Create Class"
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
