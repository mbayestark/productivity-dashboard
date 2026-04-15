interface Props {
  progress: number
}

export default function OverallProgressRing({ progress }: Props) {
  const radius = 54
  const stroke = 8
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={136} height={136} className="-rotate-90">
        <circle
          cx={68} cy={68} r={radius}
          fill="none" stroke="#e5e7eb" strokeWidth={stroke}
        />
        <circle
          cx={68} cy={68} r={radius}
          fill="none" stroke="#6366f1" strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute text-3xl font-bold text-gray-900">{progress}%</span>
    </div>
  )
}
