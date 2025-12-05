import * as React from 'react';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const showFallback = !src || imageError;
  const initials = fallback ? getInitials(fallback) : '?';

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full bg-[hsl(var(--muted))]',
        sizeClasses[size],
        className
      )}
      role="img"
      aria-label={alt || fallback || 'Avatar'}
      {...props}
    >
      {showFallback ? (
        <span className="flex h-full w-full items-center justify-center font-medium text-[hsl(var(--muted-foreground))]">
          {initials}
        </span>
      ) : (
        <img
          src={src}
          alt={alt || fallback || 'Avatar'}
          className="aspect-square h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}
