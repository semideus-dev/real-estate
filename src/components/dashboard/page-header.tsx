import React from "react";

export default function PageHeader({ header }: { header: string }) {
  return <h1 className="text-3xl font-semibold mb-8">{header}</h1>;
}
