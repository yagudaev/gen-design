import { Progress } from '@/components/ui/progress'

export default function PlaylistListeningProgress({
  percentComplete,
}: {
  percentComplete: number
}) {
  return (
    <div className="flex items-center gap-4 w-[200px]">
      <Progress
        value={percentComplete}
        className="flex-1"
        aria-label="Listening Progress"
      />
      <span className="w-12 text-xs text-muted-foreground">
        {percentComplete}%
      </span>
    </div>
  )
}
