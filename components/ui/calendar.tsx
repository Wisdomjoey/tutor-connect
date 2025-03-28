"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const selectRef = React.useRef<HTMLSelectElement>(null);

  return (
    <DayPicker
      captionLayout="dropdown"
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-primary rounded-lg text-white", className)}
      classNames={{
        months: "flex flex-col relative",
        month: "space-y-4",
        dropdowns: "flex justify-center relative items-center gap-2",
        // caption_label: "text-sm font-medium",
        nav: "space-x-1 flex justify-between relative",
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        YearsDropdown: ({ value, options, onChange }) => {
          return (
            <Select
              value={value?.toString()}
              onValueChange={(val) => {
                if (selectRef.current) {
                  selectRef.current.value = val;
                  selectRef.current.dispatchEvent(
                    new Event("change", { bubbles: true })
                  );
                }
              }}
            >
              <select
                value={value}
                ref={selectRef}
                onChange={onChange}
                className="hidden pointer-events-none"
                // {...otherProps}
              >
                {options?.map((val, ind) => (
                  <option
                    key={ind}
                    disabled={val.disabled}
                    value={val.value.toString()}
                  >
                    {val.label}
                  </option>
                ))}
              </select>

              <SelectTrigger className="p-0 border-none [&>svg]:hidden w-fit shadow-none font-medium h-7">
                <SelectValue placeholder={value} />
              </SelectTrigger>

              <SelectContent className="bg-white">
                {options?.map((val, ind) => (
                  <SelectItem
                    key={ind}
                    disabled={val.disabled}
                    value={val.value.toString()}
                  >
                    {val.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
        MonthsDropdown: ({ value, options, onChange }) => {
          return (
            <Select
              value={value?.toString()}
              onValueChange={(val) => {
                if (selectRef.current) {
                  selectRef.current.value = val;
                  selectRef.current.dispatchEvent(
                    new Event("change", { bubbles: true })
                  );
                }
              }}
            >
              <select
                value={value}
                ref={selectRef}
                onChange={onChange}
                className="hidden pointer-events-none"
                // {...otherProps}
              >
                {options?.map((val, ind) => (
                  <option
                    key={ind}
                    disabled={val.disabled}
                    value={val.value.toString()}
                  >
                    {val.label}
                  </option>
                ))}
              </select>

              <SelectTrigger className="p-0 border-none [&>svg]:hidden w-fit shadow-none font-medium h-7">
                <SelectValue placeholder={value} />
              </SelectTrigger>

              <SelectContent className="bg-white">
                {options?.map((val, ind) => (
                  <SelectItem
                    key={ind}
                    disabled={val.disabled}
                    value={val.value.toString()}
                  >
                    {val.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
        PreviousMonthButton: ({ className, ...props }) => (
          <Button
            className={cn(
              buttonVariants({ variant: "outline" }),
              "p-0 bg-transparent opacity-50 hover:opacity-100 rounded-md h-7 w-7 absolute left-1 z-10",
              className
            )}
            {...props}
          >
            <ChevronLeft className={"h-4 w-4 stroke-white"} />
          </Button>
        ),
        NextMonthButton: ({ className, ...props }) => (
          <Button
            className={cn(
              buttonVariants({ variant: "outline" }),
              "p-0 bg-transparent opacity-50 hover:opacity-100 rounded-md h-7 w-7 absolute right-1 z-10",
              className
            )}
            {...props}
          >
            <ChevronRight className={"h-4 w-4 stroke-white"} />
          </Button>
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
