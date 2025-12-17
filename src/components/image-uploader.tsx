'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ImageUploaderProps = {
  onImagesChange: (images: string[]) => void;
};

export default function ImageUploader({ onImagesChange }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { formState: { errors } } = useFormContext();

  const placeholderImage = PlaceHolderImages.find(p => p.id === 'uploader-placeholder');

  const handleFiles = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    const newImages: string[] = [];
    let processedCount = 0;

    if (fileArray.length === 0) return;

    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          newImages.push(e.target.result);
        }
        processedCount++;
        if (processedCount === fileArray.length) {
          const allImages = [...images, ...newImages];
          setImages(allImages);
          onImagesChange(allImages);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [images, onImagesChange]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };
  
  const handleClearImages = () => {
    setImages([]);
    onImagesChange([]);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold font-headline tracking-tight">Item Images</h2>
      {images.length > 0 ? (
        <div className="space-y-4">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-video items-center justify-center p-0 relative overflow-hidden rounded-lg">
                           <Image src={src} alt={`Uploaded image ${index + 1}`} fill style={{ objectFit: 'contain' }} />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
             <div className="flex justify-center">
                <Button variant="destructive" onClick={handleClearImages}><X className="mr-2 h-4 w-4" /> Clear Images</Button>
            </div>
        </div>
      ) : (
        <div
          className={cn(
            'relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
            isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50',
            errors.images ? 'border-destructive' : ''
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <div className="absolute inset-0">
            {placeholderImage && (
                <Image
                    src={placeholderImage.imageUrl}
                    alt={placeholderImage.description}
                    data-ai-hint={placeholderImage.imageHint}
                    fill
                    className="object-cover opacity-10 rounded-lg"
                />
            )}
          </div>
          <div className="relative text-center z-10">
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-semibold text-foreground">Drag & drop images here, or click to select</p>
            <p className="text-sm text-muted-foreground">Upload one or more photos of your item.</p>
            {errors.images && (
                <p className="text-sm text-destructive mt-2">{(errors.images.message as string)}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
