import { z } from "zod";

export const addDeveloperSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  age: z.string().min(1, "Age must be greater than 0")
});

export type AddDeveloperForm = z.infer<typeof addDeveloperSchema>;