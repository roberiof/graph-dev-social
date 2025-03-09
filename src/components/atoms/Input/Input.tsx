import { InputMask } from "@react-input/mask";
import { FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";
import { InputProps } from "./types";

const Input = <T extends FieldValues>({
  mask,
  register,
  name,
  className,
  classNameDiv,
  ...props
}: InputProps<T>) => {

  const inputProps = {
    className: cn(
      "bg-[#F3F5F6] px-4 w-full h-[50px] rounded-[8px] text-[#333333] placeholder:text-[#606060] text-base outline-none",
      className
    ),
    ...props,
    ...(register && name && register(name))
  };

  return (
    <div className={cn("relative w-full", classNameDiv)}>
      {mask ? (
        <InputMask {...inputProps} mask={mask} replacement={{ _: /\d/ }} />
      ) : (
        <input {...inputProps} />
      )}
    </div>
  );
};

export default Input;