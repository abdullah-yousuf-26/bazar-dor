export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse flex flex-col justify-between">
      <div className="flex items-start gap-3.5 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="flex items-end justify-between pt-2">
        <div className="space-y-1.5 w-1/3">
          <div className="h-2.5 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-4/5" />
        </div>
        <div className="h-6 w-14 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}