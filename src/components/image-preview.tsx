'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {images.map((image, index) => (
            <div key={index} className="relative aspect-square">
                <div className="relative w-full h-full" draggable>
                  <Image
                      src={image}
                      alt={`Product Preview ${index + 1}`}
                      fill
                      className="object-contain rounded-md"
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', image);
                      }}
                  />
                </div>
            </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
