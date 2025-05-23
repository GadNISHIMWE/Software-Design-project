import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-300">
      <div className="border border-gray-300 rounded-md overflow-hidden mx-auto my-8 w-full max-w-4xl bg-white">
        <Navbar />

        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-[#2e7d32]">Our Mission</h2>
              <p className="mt-2 text-sm">
                At Smart Greenhouse Management System, our mission is to revolutionize agriculture by leveraging
                cutting-edge IoT technology to create sustainable, efficient, and productive growing environments with
                intelligent tools that enhance crop productivity, reduce resource consumption, and optimize operations
                for farmers worldwide.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#2e7d32]">Key Features</h2>
              <p className="mt-2 text-sm">
                Our System integrates IoT sensors, AI-driven analytics, and cloud computing to provide real-time
                monitoring and control of greenhouse conditions for optimal plant growth.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-[#2e7d32] mr-2">•</span>
                  <span>Real-time monitoring of temperature, humidity, soil moisture, and light intensity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#2e7d32] mr-2">•</span>
                  <span>AI-powered climate control for optimal plant growth</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#2e7d32] mr-2">•</span>
                  <span>Mobile and web interface applications</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#2e7d32] mr-2">•</span>
                  <span>Energy-efficient solutions with renewable energy integration</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#2e7d32] mr-2">•</span>
                  <span>Secure data logging and traceability using blockchain technology</span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold text-[#2e7d32]">Our Team</h2>
              <p className="mt-2 text-sm">
                We are a diverse team of agricultural experts, software engineers, and IoT specialists dedicated to
                transforming agriculture through innovation. Our expertise in IoT, AI, and cloud computing enables us to
                deliver a robust and effective solution for modern farming challenges.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
