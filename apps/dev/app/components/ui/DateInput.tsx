"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

type DateInputProps = {
  name: string;
  value: string;
  required?: boolean;
};

export default function DateInput(props: DateInputProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (props.value) {
      const parsedDate = Date.parse(props.value);
      return new Date(parsedDate);
    }
    return undefined;
  });

  return (
    <div className="flex flex-col">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date: React.SetStateAction<Date | undefined>) => {
              setDate(date);
              setOpen(false);
            }}
            required={props.required}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
