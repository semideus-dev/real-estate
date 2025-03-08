import { Sidebar } from "@/components/dashboard/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className="flex min-h-screen">
      <Sidebar session={session} />
      <main className="flex-1 lg:ml-[280px] p-4">{children}</main>
    </div>
  );
}
