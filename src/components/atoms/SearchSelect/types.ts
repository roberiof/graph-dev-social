
export interface SearchSelectProps {
  options: string[];
  className?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  contentClassName?: string;
  emptyPlaceholder?: string;
}