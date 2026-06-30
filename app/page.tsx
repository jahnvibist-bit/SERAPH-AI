import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Sidebar />

      <main className="ml-[288px] flex h-screen overflow-hidden pt-[52px] transition-[margin-left] duration-300 ease-out peer-data-[collapsed=true]:ml-[72px]">
        <DashboardLayout />
      </main>
    </div>
  );
}
