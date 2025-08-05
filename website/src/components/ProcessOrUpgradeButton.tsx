
import { LucideLock } from 'lucide-react'

import { ProcessingButton } from '@/components/ProcessingButton'
import { Button, ButtonProps } from '@/components/ui/button'
import {
  estimateDuration,
  estimateDurationInSeconds,
} from '@/lib/estimateCosts'
import { Chapter, Chunk, SerializedUser, Version } from '@/types'

export function ProcessOrUpgradeButton({
  chapter,
  projectId,
  onSuccess,
  user,
  canProcess,
  onUnlockClick,
  chunks,
  setChunks,
  variant,
  remainingCredits,
  requiredCredits,
}: {
  chapter: Chapter | null
  projectId: number
  user: SerializedUser | null
  onSuccess: (version: Version | null) => void
  canProcess: boolean
  remainingCredits: number
  requiredCredits: number
  onUnlockClick: () => void
  chunks: Chunk[]
  setChunks: (chunks: Chunk[]) => void
  variant: ButtonProps['variant']
}) {
  if (!canProcess) {
    return (
      <Button
        variant="outline"
        onClick={onUnlockClick}
        className="flex items-center space-x-2 text-gray-500"
      >
        <LucideLock />
        <span>Process</span>
      </Button>
    )
  }

  const partialProcessingMessage =
    chapter?.order === 1 &&
    requiredCredits > remainingCredits &&
    remainingCredits > 0 &&
    requiredCredits > 0
      ? ` first ${Math.round(estimateDurationInSeconds(remainingCredits) / 60)} minutes`
      : ''

  return (
    <ProcessingButton
      label={`Process${partialProcessingMessage}`}
      chapter={chapter}
      chunks={chunks}
      onSuccess={onSuccess}
      projectId={projectId}
      user={user}
      variant={variant}
      setChunks={setChunks}
    />
  )
}
