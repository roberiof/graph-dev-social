import { z } from "zod";

export const addCompanySchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  industry: z.string().min(1, "Industry is required"), 
  revenue: z.string().min(1, "Revenue must be greater than 0")
});

export type AddCompanyForm = z.infer<typeof addCompanySchema>;

