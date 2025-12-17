import { z } from "zod";

export const listingFormSchema = z.object({
  images: z.array(z.string()).min(1, "Please upload at least one image."),
  brand: z.string().optional(),
  model: z.string().optional(),
  size: z.string().optional(),
  style: z.string().optional(),
  color: z.string().optional(),
  gender: z.string().optional(),
  condition: z.string().optional(),
  targetPrice: z.coerce.number({invalid_type_error: "Please enter a valid price."}).positive("Price must be a positive number.").optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  disclaimer: z.string().optional(),
});

export type ListingFormValues = z.infer<typeof listingFormSchema>;
