"use client"

import UserSidebar from "@/components/user-sidebar"

export default function UserRecommendations() {
  return (
    <div className="flex h-screen bg-gray-100">
      <UserSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-4 bg-white border-b">
          <h1 className="text-lg font-medium">Welcome User Jean de Dieu</h1>
        </div>

        <div className="p-6">
          <div className="bg-white p-6 rounded-md shadow-sm">
            <h2 className="text-lg font-medium mb-4">Recommendations</h2>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm">
                Hello! there is no recommendation at this moment all things in the green house is in normal state stay
                altered will inform you via email or by message if there is any recommendation.
                <br />
                <br />
                thank you!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
