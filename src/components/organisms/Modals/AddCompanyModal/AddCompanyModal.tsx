import { companyColor } from "@/common/constants/colors";
import { useGraphData } from "@/common/context/GraphData";
import InputField from "@/components/molecules/InputField/InputField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { errorToast, successToast } from "@/utils/toast";
import { apiClient } from "@/utils/utils";
import { AddCompanyForm, addCompanySchema } from "@/validations/add-company";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddCompanyModalProps } from "./types";

export function AddCompanyModal({ open, onOpenChange }: AddCompanyModalProps) {
  const { setGraphData } = useGraphData();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<AddCompanyForm>({
    resolver: zodResolver(addCompanySchema),
    defaultValues: {
      name: '',
      location: '',
      industry: '',
      revenue: '0'
    }
  });

  const onSubmit = async(data: AddCompanyForm) => {
    const response = await apiClient.post('/companies', data);

    if (response.error) {
      errorToast('Error adding company');
    } else {
      onOpenChange(false);
      successToast('Company added successfully');
      reset();
      setGraphData((prev) => ({
        links: prev?.links ?? [],
        nodes: [...(prev?.nodes ?? []), { id: response.data.id, name: data.name, type: 'Company', color: companyColor }]
      }));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
          <DialogDescription>
            Add a new company to the graph.
          </DialogDescription>
        </DialogHeader>
        <form id="add-company-form" className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            name="name"
            register={register}
            formErrors={errors}
            label="Name"
          />
          <InputField
            name="location"
            register={register}
            formErrors={errors}
            label="Location"
          />
          <InputField
            name="industry"
            register={register}
            formErrors={errors}
            label="Industry"
          />
          <InputField
            name="revenue"
            register={register}
            formErrors={errors}
            label="Revenue"
            type="number"
          />
        </form>
        <DialogFooter>
          <button type="submit" form="add-company-form" className="bg-black text-white px-4 py-2 rounded-md" >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
