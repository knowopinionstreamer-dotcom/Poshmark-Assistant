'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { UploadCloud, Loader2, X, Sparkles, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useFormContext } from 'react-hook-form';
import { FormField, FormControl, FormItem, FormMessage } from './ui/form';

type ImageUploaderProps = {
  onImageUpload: (imageDataUris: string[]) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  images: string[];
  onClear: () => void;
  onImageRemove: (index: number) => void;
};

export default function ImageUploader({ onImageUpload, onAnalyze, isLoading, images, onClear, onImageRemove }: ImageUploaderProps) {
  const { control } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const placeholder = PlaceHolderImages.find(p => p.id === 'uploader-placeholder');
  const hasImages = images.length > 0;

  const resizeAndToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Could not get canvas context'));
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      toast({
          variant: "destructive",
          title: "No Images Selected",
          description: "Please select one or more image files.",
      });
      return;
    }
    
    try {
      const resizingPromises = imageFiles.map(resizeAndToBase64);
      const base64Uris = await Promise.all(resizingPromises);
      onImageUpload(base64Uris); 
    } catch (error) {
      toast({
          variant: "destructive",
          title: "Error Reading Files",
          description: "Could not process the selected images.",
      });
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await processFiles(e.target.files);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    await processFiles(e.dataTransfer.files);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Item Images</CardTitle>
        {hasImages && !isLoading && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        <FormField
            control={control}
            name="images"
            render={() => (
                <FormItem>
                    <FormControl>
                        <div
                        className={cn(
                            "relative w-full h-full min-h-[200px] rounded-lg flex flex-col justify-center items-center text-center p-4 transition-colors group border-2 border-dashed border-muted-foreground/50 cursor-pointer hover:border-primary"
                        )}
                        onClick={handleAreaClick}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                            multiple
                        />
                        
                        <div className="relative z-10 flex flex-col items-center pointer-events-none">
                            <UploadCloud className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                            <p className="mt-4 font-semibold text-foreground">Click or drag & drop to upload</p>
                            <p className="text-sm text-muted-foreground">Add more images anytime</p>
                        </div>
                        
                        {isLoading && (
                            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col justify-center items-center rounded-lg z-20">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            <p className="mt-4 text-lg font-medium text-foreground">Analyzing images...</p>
                            </div>
                        )}
                        </div>
                    </FormControl>
                    <FormMessage className="pt-2" />
                </FormItem>
            )}
        />
        {hasImages && (
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {images.map((image, index) => (
                    <div key={index} className="relative group/item aspect-square">
                        <Image
                            src={image}
                            alt={`Product Preview ${index + 1}`}
                            fill
                            className="object-contain rounded-md border"
                        />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                onImageRemove(index);
                            }}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove image</span>
                        </Button>
                    </div>
                ))}
            </div>
        )}
      </CardContent>
      
      {hasImages && (
        <CardFooter className="pt-2">
            <Button 
                variant="secondary"
                onClick={onAnalyze} 
                disabled={isLoading} 
                className="w-full text-lg h-12"
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-5 w-5" />
                )}
                Analyze Images with AI
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
