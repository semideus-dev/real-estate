"use client";
import React from "react";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PageHeader from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { Home, MapPin, Ruler } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 1500, {
      message: "Price must be at least ₹1500.",
    }),

  area: z
    .string()
    .min(1, "Area is required.")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 100, {
      message: "Area must be at least 100 sqft.",
    }),

  beds: z.string().min(1, "Beds is required."),

  baths: z.string().min(1, "Baths is required."),

  listing: z.enum(["RENT", "SALE"], {
    required_error: "Listing type is required.",
  }),
  facing: z.enum(["NORTH", "SOUTH", "EAST", "WEST"], {
    required_error: "Facing direction is required.",
  }),
  condition: z.enum(["OLD", "NEW", "REFURNISHED"], {
    required_error: "Property condition is required.",
  }),

  isCornerPlot: z.boolean().default(false),
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
      isCornerPlot: false,
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-medium">Basic Information</h2>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
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
                        <Input  {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-medium">Location</h2>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-medium">Property Details</h2>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                        />
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
                        <Input
                          type="number"
                          {...field}
                        />
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
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                        />
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
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                        />
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
                            <SelectValue placeholder="Select listing type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="RENT">For Rent</SelectItem>
                          <SelectItem value="SALE">For Sale</SelectItem>
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
                      <FormLabel>Facing Direction</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select facing" />
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
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Condition</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="OLD">Old</SelectItem>
                          <SelectItem value="REFURNISHED">
                            Refurnished
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isCornerPlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corner Plot</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        defaultValue={field.value ? "true" : "false"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Is it a corner plot?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {formState.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <PiSpinner className="animate-spin" />
                </div>
              ) : (
                "Create Property Listing"
              )}
            </Button>
          </form>
        </Form>
      </Form>
    </div>
  );
}
