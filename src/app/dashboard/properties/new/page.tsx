"use client";
import React from "react";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PageHeader from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FaIndianRupeeSign, FaBath, FaBed } from "react-icons/fa6";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PiSpinner } from "react-icons/pi";
import { addProperty } from "@/lib/actions/property.actions";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  address: z.string().min(10, "Address must be detailed."),
  city: z.string().min(2, "City must be at least 2 characters."),
  state: z.string().min(2, "State must be at least 2 characters."),
  postalCode: z.string().min(5, "Postal code must be at least 5 characters."),

  socialId: z.string().min(5, "Social ID must be at least 5 characters."),

  price: z
    .string()
    .min(1, "Price is required.")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 100, {
      message: "Price must be at least $100.",
    }),

  area: z
    .string()
    .min(1, "Area is required.")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 100, {
      message: "Area must be at least 100 sqft.",
    }),

  beds: z
    .string()
    .min(1, "Beds is required.")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: "There must be at least 1 bed.",
    }),

  baths: z
    .string()
    .min(1, "Baths is required.")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
      message: "There must be at least 1 bathroom.",
    }),

  listing: z.enum(["RENT", "SALE"], {
    required_error: "Listing type is required.",
  }),
  facing: z.enum(["NORTH", "SOUTH", "EAST", "WEST"], {
    required_error: "Facing direction is required.",
  }),
  condition: z.enum(["OLD", "NEW", "REFURNISHED"], {
    required_error: "Property condition is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewPropertyPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      socialId: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      price: "",
      area: "",
      beds: "",
      baths: "",
      listing: "RENT",
      facing: "NORTH",
      condition: "NEW",
    },
  });

  const { formState } = form;

  async function onSubmit(data: FormValues) {
    try {
      await addProperty(data);
      toast("Property added successfully!");
    } catch (error) {
      toast("Property creation failed!", {
        description: "Please try again.",
      });
      console.log(error);
    }
  }
  return (
    <div>
      <PageHeader header="New Property" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="socialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social ID (Instagram)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={4} className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea rows={4} className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="listing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Listing Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Listing Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="RENT">Rent</SelectItem>
                      <SelectItem value="SALE">Sale</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facing</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Facing" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NORTH">North</SelectItem>
                      <SelectItem value="SOUTH">South</SelectItem>
                      <SelectItem value="EAST">East</SelectItem>
                      <SelectItem value="WEST">West</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input className="peer ps-9" type="number" {...field} />
                      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                        <FaIndianRupeeSign size={16} aria-hidden="true" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="beds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beds</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input className="peer ps-9" type="number" {...field} />
                      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                        <FaBed size={16} aria-hidden="true" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="baths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Baths</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input className="peer ps-9" type="number" {...field} />
                      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                        <FaBath size={16} aria-hidden="true" />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area (sq.ft)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full text-white"
            disabled={form.formState.isSubmitting}
          >
            {formState.isSubmitting ? (
              <PiSpinner className="animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
