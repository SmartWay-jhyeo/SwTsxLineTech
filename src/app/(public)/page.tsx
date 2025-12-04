import { ServicePanel } from "@/components/shared/ServicePanel";

const services = [
  {
    id: "lane",
    title: "차선\n주차선",
    backgroundImage: "/images/bg-lane.jpg",
    portfolioLink: "/portfolio?category=lane",
    quoteLink: "/quote/lane",
  },
  {
    id: "epoxy",
    title: "바닥 에폭시\n우레탄방수",
    backgroundImage: "/images/bg-epoxy.jpg",
    portfolioLink: "/portfolio?category=epoxy",
    quoteLink: "/quote/epoxy",
  },
  {
    id: "paint",
    title: "내/외부 도장",
    backgroundImage: "/images/bg-paint.jpg",
    portfolioLink: "/portfolio?category=paint",
    quoteLink: "/quote/paint",
  },
];

export default function Page() {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-background">
      {services.map((service) => (
        <ServicePanel
          key={service.id}
          title={service.title}
          backgroundImage={service.backgroundImage}
          portfolioLink={service.portfolioLink}
          quoteLink={service.quoteLink}
        />
      ))}
    </div>
  );
}
