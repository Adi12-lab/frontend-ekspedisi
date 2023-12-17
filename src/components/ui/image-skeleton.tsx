import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  key: number,
  className?: string;
}

function ImageWithSkeleton({ className, src, ...props }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div>
      {!isLoaded && (
        <div
          className={cn(`animate-pulse rounded-md bg-slate-400`, className)}
        />
      )}
      <img 
        src={src}
        onLoad={()=> setIsLoaded(true)}
        className={cn(`${isLoaded ? "" : "hidden"} object-cover`, className)} 
        {...props}
      />
    </div>
  );
}

export { ImageWithSkeleton };
