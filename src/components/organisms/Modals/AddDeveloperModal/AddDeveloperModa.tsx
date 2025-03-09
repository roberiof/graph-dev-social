    import { developerColor } from "@/common/constants/colors";
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
import { AddDeveloperForm, addDeveloperSchema } from "@/validations/add-developer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddDeveloperModalProps } from "./types";

export function AddDeveloperModal({ open, onOpenChange }: AddDeveloperModalProps) {
  const { setGraphData } = useGraphData();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<AddDeveloperForm>({
    resolver: zodResolver(addDeveloperSchema),
    defaultValues: {
      name: '',
      location: '',
      age: '18'
    } 
  });

  const onSubmit = async(data: AddDeveloperForm) => {
    const response = await apiClient.post('/developers', data);

    if (response.error) {
      errorToast('Error adding developer');
    } else {
      onOpenChange(false);
      successToast('Developer added successfully');
      reset();
      setGraphData((prev) => ({
        links: prev?.links ?? [],
        nodes: [...(prev?.nodes ?? []), { id: response.data.id, name: data.name, type: 'Developer', color: developerColor }]
      }));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Developer</DialogTitle>
          <DialogDescription>
            Add a new developer to the graph.
          </DialogDescription>
        </DialogHeader>
        <form id="add-developer-form" className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
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
            name="age"
            register={register}
            formErrors={errors}
            label="Age"
          />
        </form>
        <DialogFooter>
          <button type="submit" form="add-developer-form" className="bg-black text-white px-4 py-2 rounded-md" >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
