export default function Footer() {
  return (
    <div className="relative mt-auto">
      <div className="h-16 bg-[#2e7d32] rounded-t-[50%] w-full flex items-center justify-center">
        <p className="text-white text-xs">© {new Date().getFullYear()} Smart Greenhouse Management System</p>
      </div>
    </div>
  )
}
