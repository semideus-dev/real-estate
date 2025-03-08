import PageHeader from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProperties } from "@/lib/actions/property.actions";
import { formatPrice } from "@/lib/utils";
import { LucideLandPlot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaBath, FaBed } from "react-icons/fa6";
import { PiPlus } from "react-icons/pi";

export default async function PropertiesPage() {
  const properties = await getProperties();

  if (!properties) {
    return (
      <div>
        <PageHeader header="Properties" />
        <p className="text-center my-4">No properties found.</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader header="Properties" />
      <div className="flex items-center gap-2">
        <Link href="/dashboard/properties/new">
          <Button className="flex items-center">
            <span>Add Property</span>
            <PiPlus className="w-4 h-4" />
          </Button>
        </Link>
        <Input className="w-full" placeholder="Search for a property..." />
      </div>
      <div className="grid my-10 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {properties.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <h3 className="text-lg font-semibold">No properties found</h3>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              className="group relative border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-video">
                <Image
                  src={property.thumbnailUrl || "/placeholder.svg"}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
                {/* <div className="absolute bottom-2 left-2 flex gap-1">
                  {property.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-white/80"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div> */}
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
                {/* <div className="flex items-center gap-1 mt-1">
                  <div className="flex items-center text-amber-500">
                    {"★".repeat(Math.floor(property.rating))}
                    {"☆".repeat(5 - Math.floor(property.rating))}
                  </div>
                  <span className="text-sm">({property.reviews} reviews)</span>
                </div> */}
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
                    <LucideLandPlot className="w-4 h-4 text-muted-foreground" />
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
