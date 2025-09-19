import { Button } from "./ui/button";
import { Ellipsis } from "lucide-react";
import { href, NavLink, useNavigate, useSearchParams } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

export default function NavMenu() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="fixed bottom-6 left-6" variant="outline" size="icon">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => navigate(href("/config") + `?${search}`)}
        >
          Config
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate(href("/data") + `?${search}`)}
        >
          Data logs
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
