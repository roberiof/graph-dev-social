import { FieldValues } from "react-hook-form";

import Input from "@/components/atoms/Input/Input";
import { cn } from "@/lib/utils";
import { InputFieldProps } from "./types";


const InputField = <T extends FieldValues>({
  register,
  name,
  className,
  labelClassName,
  mask,
  formErrors,
  label,
  classNameDiv,
  ...props
}: InputFieldProps<T>) => {
  const errorMessage = formErrors[name]?.message as string;

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1",
        classNameDiv
      )}
    >
      {label && (
        <label
          className={cn(labelClassName, "text-[18px] text-[#333333]")}
        >
          {label}
        </label>
      )}
      <div className={cn("flex flex-col gap-1")}>
        <Input
          {...props}
          className={className}
          name={name}
          register={register}
          mask={mask}
        />
        {errorMessage && <p className="text-[#FF0000] text-xs">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default InputField;