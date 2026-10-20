"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GalleryHoverCarouselItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
  imageAlt?: string;
}

function HoverCard({
  item,
  tall = false,
}: {
  item: GalleryHoverCarouselItem;
  tall?: boolean;
}) {
  return (
    <Link
      href={item.url}
      className={cn(
        "group relative block w-full rounded-3xl outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
        tall ? "h-[26rem] md:h-full md:min-h-[24rem]" : "h-[300px] md:h-[350px]"
      )}
    >
      <Card className="overflow-hidden rounded-xl h-full w-full rounded-3xl">
        {/* Image */}
        <div className="relative h-full w-full transition-all duration-500 max-md:h-1/2 group-hover:h-1/2 group-focus-visible:h-1/2">
          <Image
            width={400}
            height={300}
            src={item.image}
            alt={item.imageAlt ?? item.title}
            className="h-full w-full object-cover object-center"
          />
          {/* Fade overlay at bottom */}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-500 max-md:opacity-100 group-hover:opacity-100 group-focus-visible:opacity-100" />
        </div>

        {/* Text Section */}
        <div className="absolute bottom-0 left-0 w-full px-4 transition-all duration-500 flex-col justify-center bg-background/95 backdrop-blur-sm opacity-0 max-md:flex max-md:h-1/2 max-md:opacity-100 group-hover:h-1/2 group-hover:flex group-hover:opacity-100 group-focus-visible:h-1/2 group-focus-visible:flex group-focus-visible:opacity-100">
          <h3 className="text-lg font-medium md:text-xl">{item.title}</h3>
          <p className="text-muted-foreground text-sm md:text-base line-clamp-2">
            {item.summary}
          </p>
          <Button
            variant="outline"
            size="icon"
            tabIndex={-1}
            aria-hidden
            className="pointer-events-none absolute bottom-2 right-2 border border-gray-200 dark:border-gray-800 hover:-rotate-45 group-hover:-rotate-45 group-focus-visible:-rotate-45 transition-all duration-500 rounded-full mt-2 px-0 flex items-center gap-1 text-primary hover:text-primary/80"
          >
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </Card>
    </Link>
  );
}

export default function GalleryHoverCarousel({
  heading = "Featured Projects",
  items = [
    {
      id: "item-1",
      title: "Build Modern UIs",
      summary:
        "Create stunning user interfaces with our comprehensive design system.",
      url: "#",
      image:
        "https://cdn.21st.dev/assets/mirror/60/60f1fc317cc965fa57d1bb420b79a441aaebc281f64fceda8b7bff238686177d.png",
    },
    {
      id: "item-2",
      title: "Computer Vision Technology",
      summary:
        "Powerful image recognition and processing capabilities that allow AI systems to analyze, understand, and interpret visual information from the world.",
      url: "#",
      image:
        "https://cdn.21st.dev/assets/mirror/5b/5be809c811b5c484f4f36c477a13b0af7da32fdd20512c7f6c2c38e681e32afa.png",
    },
    {
      id: "item-3",
      title: "Machine Learning Automation",
      summary:
        "Self-improving algorithms that learn from data patterns to automate complex tasks and make intelligent decisions with minimal human intervention.",
      url: "#",
      image:
        "https://cdn.21st.dev/assets/mirror/6c/6c1a829d1b4c7e47d0916ff1ab901e414b6943ca338094e2bbbdba35da4e5446.png",
    },
    {
      id: "item-4",
      title: "Predictive Analytics",
      summary:
        "Advanced forecasting capabilities that analyze historical data to predict future trends and outcomes, helping businesses make data-driven decisions.",
      url: "#",
      image:
        "https://cdn.21st.dev/assets/mirror/ff/ff0d274d6f15232322c8938fc0c067cb4a70ef4e568b8b61256f8254749f9374.png",
    },
    {
      id: "item-5",
      title: "Neural Network Architecture",
      summary:
        "Sophisticated AI models inspired by human brain structure, capable of solving complex problems through deep learning and pattern recognition.",
      url: "#",
      image:
        "https://cdn.21st.dev/assets/mirror/58/58274556122ef7e984b226b075e8ab2c153e238896e21ad4b56d0ce447455c31.png",
    },
  ],
  showHeader = true,
  className,
}: {
  heading?: string;
  demoUrl?: string;
  items?: GalleryHoverCarouselItem[];
  /** Hide the featured-projects heading and carousel arrows. Two items then sit side by side. */
  showHeader?: boolean;
  className?: string;
}) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi || !showHeader) return;
    const update = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    update();
    carouselApi.on("select", update);
    return () => {
      carouselApi.off("select", update);
    };
  }, [carouselApi, showHeader]);

  if (!showHeader) {
    return (
      <div className={cn("grid h-full min-h-0 w-full grid-cols-1 gap-4 md:grid-cols-2", className)}>
        {items.map((item) => (
          <HoverCard key={item.id} item={item} tall />
        ))}
      </div>
    );
  }

  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
          <div className="max-w-2xl">
            <h3 className="text-lg sm:text-xl lg:text-3xl font-medium text-gray-900 dark:text-white leading-relaxed">
            {heading}{" "}
            <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-3xl"> Explore our collection of innovative solutions and cutting-edge technologies designed to transform your business.</span>
          </h3>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="h-10 w-10 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="h-10 w-10 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="w-full max-w-full">
          <Carousel
            setApi={setCarouselApi}
            opts={{ breakpoints: { "(max-width: 768px)": { dragFree: true } } }}
            className="relative w-full max-w-full"
          >
            <CarouselContent className="hide-scrollbar w-full max-w-full md:ml-4 md:-mr-4">
              {items.map((item) => (
                <CarouselItem key={item.id} className="ml-6 md:max-w-[350px]">
                  <HoverCard item={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
