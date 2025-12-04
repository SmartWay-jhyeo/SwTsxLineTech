import Image from "next/image";
import { MapPin, Calendar, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = "lane" | "epoxy" | "paint";

type ProjectCardProps = {
  title: string;
  category: Category;
  location: string;
  date: string;
  area: number;
  imageUrl: string;
  className?: string;
};

const categoryLabels: Record<Category, string> = {
  lane: "차선/주차선",
  epoxy: "바닥 에폭시",
  paint: "도장공사",
};

const categoryColors: Record<Category, string> = {
  lane: "bg-primary",
  epoxy: "bg-primary",
  paint: "bg-primary",
};

export function ProjectCard({
  title,
  category,
  location,
  date,
  area,
  imageUrl,
  className,
}: ProjectCardProps) {
  return (
    <div
      className={cn(
        "group bg-card rounded-lg overflow-hidden cursor-pointer",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Category Badge */}
        <div
          className={cn(
            "absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] text-white font-medium",
            categoryColors[category]
          )}
        >
          {categoryLabels[category]}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-medium mb-3 line-clamp-1">{title}</h3>

        <div className="space-y-1.5 text-muted-foreground text-sm">
          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-primary" />
            <span>{location}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-primary" />
            <span>{date}</span>
          </div>

          {/* Area */}
          <div className="flex items-center gap-2">
            <Ruler size={14} className="text-primary" />
            <span>시공면적 {area.toLocaleString()}m²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
