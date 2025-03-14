"use server";

import { db } from "@/lib/db";

interface PropertyData {
  name: string;
  description: string;
  socialId: string;
  address: string;
  city: string;
  state: string;
  postalCode: string; // int
  price: string; // int
  area: string; // int
  beds: string; // int
  baths: string; // int
  listing: "RENT" | "SALE";
  facing: "NORTH" | "EAST" | "SOUTH" | "WEST";
  condition: "OLD" | "NEW" | "REFURNISHED";
}

interface PropertyLeadData {
  userFullName: string;
  userPhone: string;
  status: "WARM" | "COLD" | "HOT";
  propertyId: string;
}

export async function addProperty(data: PropertyData) {
    const refinedData = {
      ...data,
      price: Number(data.price),
      area: Number(data.area),
      beds: Number(data.beds),
      baths: Number(data.baths),
      postalCode: Number(data.postalCode),
    }
  try {
    await db.property.create({
      data: refinedData
    })
  } catch (error) {
    console.log(error);
  }
}

export async function getProperties() {
  try {
    const properties = await db.property.findMany();
    return properties;
  } catch (error) {
    console.log(error);
  }
}

export async function createPropertyLead(data: PropertyLeadData) {
  try {
    await db.lead.create({
      data
    })
  } catch (error) {
    console.log(error);
  }
} 

export async function getLeads() {
  try {
    const leads = await db.lead.findMany();
    return leads;
  } catch (error) {
    console.log(error);
  }
}