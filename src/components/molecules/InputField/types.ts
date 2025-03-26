import { ComponentProps } from "react";

import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister
} from "react-hook-form";

export interface InputFieldProps<T extends FieldValues>
  extends ComponentProps<"input"> {
  mask?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  formErrors: FieldErrors<T>;
  label?: string;
  labelClassName?: string;
  classNameDiv?: string;
}