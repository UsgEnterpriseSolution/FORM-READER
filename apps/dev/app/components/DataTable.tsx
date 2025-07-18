import { Form } from "react-router";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import { Input } from "./ui/input";
import { ImageZoom } from "./ui/image-zoom";

export default function DataTable() {
  return (
    <section className="space-y-2">
      <div className="bg-secondary grid size-10 place-content-center rounded-full">
        10
      </div>
      <div className="flex h-fit gap-4 border-2 border-dashed p-4">
        <DataTablePreview />
        <DataTableForm />
      </div>
    </section>
  );
}

function DataTablePreview() {
  return (
    <ImageZoom>
      <img src="/placeholder.jpg" className="h-[250px] w-[200] rounded-sm" />
    </ImageZoom>
  );
}

function DataTableForm() {
  return (
    <Form className="bg-background h-fit overflow-hidden rounded-md border">
      <Table>
        <TableBody>
          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
            <TableCell className="bg-muted/50 py-2 font-medium">
              First name
            </TableCell>
            <TableCell className="py-2">
              <Input />
            </TableCell>
          </TableRow>

          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
            <TableCell className="bg-muted/50 py-2 font-medium">
              Last name
            </TableCell>
            <TableCell className="py-2">
              <Input />
            </TableCell>
          </TableRow>

          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
            <TableCell className="bg-muted/50 py-2 font-medium">
              Email
            </TableCell>
            <TableCell className="py-2">
              <Input />
            </TableCell>
          </TableRow>

          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
            <TableCell className="bg-muted/50 py-2 font-medium">
              Phone number
            </TableCell>
            <TableCell className="py-2">
              <Input />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Form>
  );
}
