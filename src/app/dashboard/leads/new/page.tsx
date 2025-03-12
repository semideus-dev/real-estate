"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaBed, FaBath } from "react-icons/fa";
import { LandPlot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import { Property } from "@prisma/client";
import {
  createPropertyLead,
  getProperties,
} from "@/lib/actions/property.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PiSpinner } from "react-icons/pi";
import { toast } from "sonner";

const formSchema = z.object({
  userFullName: z.string(),
  userPhone: z.string(),
  status: z.enum(["HOT", "WARM", "COLD"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function PropertyListings() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    id: "",
    city: "",
    listingType: "",
    minPrice: 0,
    maxPrice: 10000000,
  });

  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      const data = await getProperties();
      if (!data) {
        return;
      }
      setProperties(data);
      setFilteredProperties(data);

      // Extract unique cities
      const uniqueCities = Array.from(
        new Set(data.map((p) => p.city.split(",").pop()?.trim()))
      ).filter(Boolean) as string[];
      setCities(uniqueCities);

      // Set max price based on highest property price
      const maxPrice = Math.max(...data.map((p) => p.price));
      setFilters((prev) => ({ ...prev, maxPrice }));
    };

    fetchProperties();
  }, []);

  // Apply filters when filter state changes
  useEffect(() => {
    const filtered = properties.filter((property) => {
      const cityMatch = !filters.city || property.city.includes(filters.city);
      const idMatch =
        !filters.id || property.id.toString().includes(filters.id);
      const listingMatch =
        !filters.listingType || property.listing === filters.listingType;
      const priceMatch =
        property.price >= filters.minPrice &&
        property.price <= filters.maxPrice;

      return cityMatch && idMatch && listingMatch && priceMatch;
    });

    setFilteredProperties(filtered);
  }, [filters, properties]);

  // Handle property selection
  const selectProperty = (propertyId: string) => {
    setSelectedProperty(propertyId === selectedProperty ? null : propertyId);
  };

  // Format price with commas
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Lead form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userFullName: "",
      userPhone: "",
      status: "WARM",
    },
  });

  const onSubmitLead = async (data: FormValues) => {
    if (!selectedProperty) {
      return;
    }
    const lead = {
      userFullName: data.userFullName,
      userPhone: data.userPhone,
      status: data.status,
      propertyId: selectedProperty,
    };
    await createPropertyLead(lead);
    toast("Lead created successfully!");
    setSelectedProperty(null);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="id">Property ID</Label>
            <Input
              id="id"
              placeholder="Search by ID"
              value={filters.id}
              onChange={(e) => setFilters({ ...filters, id: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select
              value={filters.city}
              onValueChange={(value) => setFilters({ ...filters, city: value })}
            >
              <SelectTrigger id="city">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="listingType">Listing Type</Label>
            <Select
              value={filters.listingType}
              onValueChange={(value) =>
                setFilters({ ...filters, listingType: value })
              }
            >
              <SelectTrigger id="listingType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="RENT">Rent</SelectItem>
                <SelectItem value="SALE">Sale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Budget (₹)</Label>
            <div className="pt-6 px-2">
              <Slider
                defaultValue={[filters.minPrice, filters.maxPrice]}
                max={filters.maxPrice}
                step={10000}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    minPrice: value[0],
                    maxPrice: value[1],
                  })
                }
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>₹{formatPrice(filters.minPrice)}</span>
                <span>₹{formatPrice(filters.maxPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected properties count and lead button */}
        <div className="flex items-center justify-between pt-4 border-t mt-4">
          <div>
            {selectedProperty && (
              <p className="text-sm font-medium">1 property selected</p>
            )}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={!selectedProperty} className="ml-auto">
                Create Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Lead</DialogTitle>
                <DialogDescription>
                  Enter your contact details for the selected property.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitLead)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="userFullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="userPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Status</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-3 gap-3">
                            <div
                              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all cursor-pointer ${
                                field.value === "HOT"
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-200 hover:border-red-200 hover:bg-red-50/50"
                              }`}
                              onClick={() => field.onChange("HOT")}
                            >
                              <div className="w-8 h-8 rounded-full bg-red-500 mb-2 flex items-center justify-center">
                                <span className="text-white text-sm">🔥</span>
                              </div>
                              <span
                                className={`font-medium ${
                                  field.value === "HOT"
                                    ? "text-red-500"
                                    : "text-gray-700"
                                }`}
                              >
                                Hot
                              </span>
                            </div>

                            <div
                              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all cursor-pointer ${
                                field.value === "WARM"
                                  ? "border-amber-500 bg-amber-50"
                                  : "border-gray-200 hover:border-amber-200 hover:bg-amber-50/50"
                              }`}
                              onClick={() => field.onChange("WARM")}
                            >
                              <div className="w-8 h-8 rounded-full bg-amber-500 mb-2 flex items-center justify-center">
                                <span className="text-white text-sm">👍</span>
                              </div>
                              <span
                                className={`font-medium ${
                                  field.value === "WARM"
                                    ? "text-amber-500"
                                    : "text-gray-700"
                                }`}
                              >
                                Warm
                              </span>
                            </div>

                            <div
                              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all cursor-pointer ${
                                field.value === "COLD"
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/50"
                              }`}
                              onClick={() => field.onChange("COLD")}
                            >
                              <div className="w-8 h-8 rounded-full bg-blue-500 mb-2 flex items-center justify-center">
                                <span className="text-white text-sm">❄️</span>
                              </div>
                              <span
                                className={`font-medium ${
                                  field.value === "COLD"
                                    ? "text-blue-500"
                                    : "text-gray-700"
                                }`}
                              >
                                Cold
                              </span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="submit"
                      className="w-full text-white"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <PiSpinner className="animate-spin" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Property listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium">No properties found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          filteredProperties.map((property) => (
            <div
              key={property.id}
              className={`group relative border rounded-xl overflow-hidden hover:shadow-md transition-shadow ${
                selectedProperty === property.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => selectProperty(property.id)}
            >
              <div className="absolute top-3 right-3 z-10">
                <Checkbox
                  checked={selectedProperty === property.id}
                  className="h-5 w-5 bg-white/80 border-gray-300"
                />
              </div>
              <div className="relative aspect-video">
                <Image
                  src={property.thumbnailUrl || "/placeholder.svg"}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{property.name}</h3>
                  <p className="font-bold">
                    ₹{formatPrice(property.price)}
                    {property.listing === "RENT" ? (
                      <span className="font-normal text-muted-foreground">
                        /month
                      </span>
                    ) : (
                      ""
                    )}
                  </p>
                </div>
                <p className="text-muted-foreground">{property.address}</p>
                <div className="flex items-center justify-between text-sm mt-4">
                  <div className="flex items-center gap-2">
                    <FaBed className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {property.beds} {property.beds === 1 ? "Bed" : "Beds"}{" "}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBath className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {property.baths} {property.baths === 1 ? "Bath" : "Baths"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LandPlot className="w-4 h-4 text-muted-foreground" />
                    {property.area} sq ft
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
