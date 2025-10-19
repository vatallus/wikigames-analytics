import { Skeleton } from '../ui/skeleton'

export function StatsCardSkeleton() {
  return (
    <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
      <div className="flex items-center space-x-3 mb-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-32" />
    </div>
  )
}

export function GameCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center space-x-4 flex-1">
        <Skeleton className="h-8 w-8 rounded" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-gray-800">
      <td className="py-4"><Skeleton className="h-8 w-8" /></td>
      <td className="py-4"><Skeleton className="h-4 w-32" /></td>
      <td className="py-4"><Skeleton className="h-6 w-16" /></td>
      <td className="py-4"><Skeleton className="h-4 w-20 ml-auto" /></td>
      <td className="py-4"><Skeleton className="h-4 w-20 ml-auto" /></td>
    </tr>
  )
}

export function PageLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
      
      <div className="space-y-4">
        <GameCardSkeleton />
        <GameCardSkeleton />
        <GameCardSkeleton />
        <GameCardSkeleton />
        <GameCardSkeleton />
      </div>
    </div>
  )
}
