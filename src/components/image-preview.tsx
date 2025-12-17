'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

type ImagePreviewProps = {
  images: string[];
  onClear?: () => void;
  showClearButton?: boolean;
};

export default function ImagePreview({ images, onClear, showClearButton = true }: ImagePreviewProps) {
  const hasImages = images.length > 0;

  if (!hasImages) {
    return null;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Item Images</CardTitle>
        {onClear && showClearButton && (
            <Button variant="ghost" size="sm" onClick={onClear}>
                <X className="mr-2 h-4 w-4" />
                Clear All
            </Button>
        )}
      </CardHeader>
      <CardContent>
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
            <CarouselItem key={index} className="relative basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                <div className="relative w-full aspect-square">
                  <Image
                      src={image}
                      alt={`Product Preview ${index + 1}`}
                      fill
                      className="object-contain rounded-md"
                  />
                </div>
            </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 5 && (
            <>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
            </>
          )}
        </Carousel>
      </CardContent>
    </Card>
  );
}
