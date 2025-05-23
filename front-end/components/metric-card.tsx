interface MetricCardProps {
  title: string
  value: string
}

export default function MetricCard({ title, value }: MetricCardProps) {
  return (
    <div className="bg-gray-200 p-4 rounded text-center">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  )
}
