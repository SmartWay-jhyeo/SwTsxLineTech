"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ServicePanelProps = {
  title: string;
  backgroundImage: string;
  portfolioLink: string;
  quoteLink: string;
  className?: string;
};

export function ServicePanel({
  title,
  backgroundImage,
  portfolioLink,
  quoteLink,
  className,
}: ServicePanelProps) {
  return (
    <div
      className={cn(
        "group relative flex-1 h-full overflow-hidden cursor-pointer",
        className
      )}
    >
      {/* Background Image with Blur - hover: blur 감소 + 확대 */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover blur-md scale-100 transition-all duration-500 ease-out group-hover:blur-sm group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Dark Gradient Overlay - hover: 밝아짐 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 transition-all duration-500 group-hover:from-black/30 group-hover:via-black/10 group-hover:to-black/40" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white">
        {/* Title */}
        <h2 className="text-[36px] leading-[52px] tracking-[2px] text-center font-bold whitespace-pre-line mb-8 drop-shadow-lg">
          {title}
        </h2>

        {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black bg-transparent h-12 px-6 text-base font-medium"
            >
              <Link href={portfolioLink}>시공 사례 보기</Link>
            </Button>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white h-12 px-6 text-base font-medium"
            >
              <Link href={quoteLink}>견적 내기</Link>
            </Button>
          </div>
      </div>
    </div>
  );
}
