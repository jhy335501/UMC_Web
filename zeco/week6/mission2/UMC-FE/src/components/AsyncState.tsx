import type { ReactNode } from 'react';

interface LoadingStateProps {
  variant?: 'spinner' | 'skeletonGrid' | 'commentList';
  count?: number;
}

export function LoadingState({ variant = 'spinner', count }: LoadingStateProps) {
  if (variant === 'skeletonGrid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: count ?? 12 }).map((_, index) => (
          <div key={index} className="aspect-square rounded-xl bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (variant === 'commentList') {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: count ?? 4 }).map((_, index) => (
          <div key={index} className="flex gap-3 rounded-lg border border-gray-800 bg-gray-900/70 p-4">
            <div className="w-9 h-9 rounded-full bg-gray-800 animate-pulse shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 rounded bg-gray-800 animate-pulse" />
                <div className="h-3 w-16 rounded bg-gray-800 animate-pulse" />
              </div>
              <div className="h-4 w-full rounded bg-gray-800 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-gray-800 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  description?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
}

export function ErrorState({ message, description, action, secondaryAction }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div>
        <p className="text-red-400 font-semibold">{message}</p>
        {description && <p className="text-gray-500 text-sm mt-2">{description}</p>}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {action}
        {secondaryAction}
      </div>
    </div>
  );
}
