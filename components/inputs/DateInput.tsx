import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, CalendarProps } from "../ui/calendar";

type DateInputProps = CalendarProps & {
  label?: string;
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

function DateInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  ...otherProps
}: DateInputProps) {
  const date = value && value !== "" ? new Date(value) : undefined;

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP")
            ) : (
              <span>{placeholder ?? "Pick a date"}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            {...otherProps}
            id={id}
            selected={date}
            onSelect={(v) => v && onChange(v.toDateString())}
            mode="single"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateInput;
