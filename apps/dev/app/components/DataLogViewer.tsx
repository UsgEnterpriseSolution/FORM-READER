import { formateDate } from "~/utils/functions";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { Table, TableBody, TableCell, TableRow } from "./ui/table";

type DataLogViewerProps = {
  open?: boolean;
  children?: React.ReactNode;
  dataId: string;
  formTitle: string;
  extDate: string;
  data: { [k: PropertyKey]: any };
};

export default function DataLogViewer(props: DataLogViewerProps) {
  return (
    <Sheet defaultOpen={props.open}>
      <SheetTrigger asChild>{props.children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Data Log</SheetTitle>
          <SheetDescription>
            This form was extracted on{" "}
            <span className="text-primary">{formateDate(props.extDate)}</span>{" "}
            with the{" "}
            <span className="text-primary">
              {props.formTitle.toLocaleLowerCase()}
            </span>{" "}
            config.
          </SheetDescription>
        </SheetHeader>

        <section className="h-full space-y-4 overflow-y-scroll px-4">
          <div className="bg-background rounded-md border">
            <Table>
              <TableBody>
                {props.data &&
                  Object.entries(props.data).map(([key, value]) => (
                    <TableRow
                      key={key}
                      className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r"
                    >
                      <TableCell className="bg-muted/50 py-2 font-medium">
                        {key}
                      </TableCell>
                      <TableCell className="py-2">{value}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="default">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
