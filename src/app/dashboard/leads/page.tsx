import PageHeader from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLeads } from "@/lib/actions/property.actions";
import Link from "next/link";
import React from "react";
import { PiPlus } from "react-icons/pi";

export default async function LeadsPage() {
  const leads = await getLeads();

  if (!leads) {
    return (
      <div>
        <PageHeader header="Leads" />
        <p className="text-center my-4">No leads found.</p>
      </div>
    );
  }
  return (
    <div>
      <PageHeader header="Leads" />
      <div className="flex items-center gap-2">
        <Link href="/dashboard/leads/new">
          <Button className="flex items-center">
            <span>New Lead</span>
            <PiPlus className="w-4 h-4" />
          </Button>
        </Link>
        <Input className="w-full" placeholder="Search for a lead..." />
      </div>
      {leads.map((lead, index) => (
        <div key={index} className="bg-muted shadow-lg rounded-md p-4 my-4 flex items-center justify-between border">
          <span>{lead.userFullName}</span>
          <span>{lead.userPhone}</span>
          <span>{lead.status}</span>
        </div>
      ))}
    </div>
  );
}
