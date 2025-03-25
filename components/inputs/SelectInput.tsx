import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { SelectProps } from "@radix-ui/react-select";
import { Label } from "../ui/label";

type SelectInputProps = SelectProps & {
  id: string;
  label?: string;
  className?: string;
  placeholder: string;
  labelClassName?: string;
  items?: {
    value: string;
    label: string;
  }[];
  containerClassName?: string;
  onChange: (value: string) => void;
};

function SelectInput({
  id,
  items,
  label,
  onChange,
  className,
  placeholder,
  labelClassName,
  containerClassName,
  ...otherProps
}: SelectInputProps) {
  return (
    <div className={cn("space-y-2 w-full", containerClassName)}>
      {label && (
        <Label htmlFor={id} className={cn("", labelClassName)}>
          {label}
        </Label>
      )}

      <Select {...otherProps} onValueChange={onChange}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent id={id}>
          {items &&
            items.map((item, ind) => (
              <SelectItem key={ind} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectInput;
