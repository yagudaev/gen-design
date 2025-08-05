import { Badge } from '@/components/ui/badge'

export function PlanBadge({ plan }: { plan: string }) {
  return <Badge variant={plan === 'pro' ? 'default' : 'outline'}>{plan}</Badge>
}
