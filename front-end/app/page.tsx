import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import MetricCard from "@/components/metric-card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-300">
      <div className="border border-gray-300 rounded-md overflow-hidden mx-auto my-8 w-full max-w-4xl bg-white">
        <Navbar />

        <main className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:gap-8">
            <div className="md:w-2/3">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <p className="text-sm text-green-600">
                  Welcome to Intelligent IoT-Driven Greenhouse Autonomous System✓
                </p>
              </div>

              <h2 className="mt-4 text-xl font-bold">
                "Effortless Monitoring, Intelligent Control, Sustainable Growth"
              </h2>

              <p className="mt-4 text-sm text-gray-700">
                Welcome to your AI-powered Smart Greenhouse where technology meets agriculture to create a more
                efficient, productive, and eco-friendly growing environment
              </p>

              <div className="mt-6">
                <Link href="/auth/signin" className="text-blue-600 hover:underline text-sm">
                  over view of the green House
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-4 gap-4">
            <MetricCard title="Temperature" value="50%" />
            <MetricCard title="Humidity" value="70%" />
            <MetricCard title="Soil moisture" value="85%" />
            <MetricCard title="Light intensity" value="78%" />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
