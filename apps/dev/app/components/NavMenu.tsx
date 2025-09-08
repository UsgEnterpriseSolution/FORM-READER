import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Popover } from "./ui/popover";
import { Button } from "./ui/button";
import { Database, Ellipsis, Settings } from "lucide-react";
import { href, NavLink } from "react-router";

export default function NavMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Ellipsis />
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <div className="ring-muted flex flex-col rounded-md bg-white p-2 ring">
          <NavLink to={href("/config")} className="cursor-pointer">
            <Button variant="ghost" className="w-full justify-start">
              <Settings />
              <span>Config</span>
            </Button>
          </NavLink>

          <NavLink to={href("/data/:dataId?")} className="cursor-pointer">
            <Button variant="ghost" className="w-full justify-start">
              <Database />
              <span>Data logs</span>
            </Button>
          </NavLink>
        </div>
      </PopoverContent>
    </Popover>
  );
}
