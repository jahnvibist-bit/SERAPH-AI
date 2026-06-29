import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Sidebar />

      <main className="ml-[290px] min-h-screen bg-black pt-[52px] flex items-center justify-center transition-[margin-left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] peer-data-[collapsed=true]:ml-[80px]">
        <h1 className="text-4xl font-bold text-white">
          SERAPH Dashboard Coming Soon
        </h1>
      </main>
    </>
  );
}
