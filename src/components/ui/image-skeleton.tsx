import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  key: number,
  className?: string;
}

function ImageWithSkeleton({ className, src, key,...props }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <>
      {!isLoaded && (
        <div
          className={cn(`animate-pulse rounded-md bg-slate-400`, className)}
          key={key}
        />
      )}
      <img 
        src={src}
        onLoad={()=> setIsLoaded(true)}
        className={cn(`${isLoaded ? "" : "hidden"} object-cover`, className)} 
        {...props}
      />
    </>
  );
}

export { ImageWithSkeleton };
