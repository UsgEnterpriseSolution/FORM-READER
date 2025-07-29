import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { PhoneInput } from "~/components/PhoneInput";
import { Button } from "~/components/ui/button";
import {
  Form as ShadcnForm,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { Calendar } from "~/components/ui/calendar";
import type { FieldData } from "~/types";
import { Form } from "react-router";

type ReviewFormProps = {
  hookForm: UseFormReturn<FieldData>;
};

export default function ReviewForm({ hookForm }: ReviewFormProps) {
  return (
    <section>
      <ShadcnForm {...hookForm}>
        <Form id="review-form" method="POST" className="space-y-4">
          <section className="space-y-2">
            <p className="text-sm text-zinc-600">Employee details</p>
            <div className="h-fit space-y-3 border-2 border-dashed p-4">
              <FormField
                control={hookForm.control}
                name="employeeData.employeeNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee NO</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: USG0000"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="employeeData.dateOfEngagement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Engagement</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-start font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="employeeData.subsidiary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subsidiary</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Software"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="employeeData.department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Enterprise Solutions"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="employeeData.subunit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subunit</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: ERP Solutions & utils"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-sm text-zinc-600">Personal detials (A)</p>
            <div className="h-fit space-y-3 border-2 border-dashed p-4">
              <FormField
                control={hookForm.control}
                name="personalData.name.surName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surname</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Martinson"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.name.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Edwin"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.name.middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Otu"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.name.otherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other name(s)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Kofi"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={hookForm.control}
                name="personalData.name.maidenSurName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maiden surname (Females only)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Tanstack"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-sm text-zinc-600">Personal detials (B)</p>
            <div className="h-fit space-y-3 border-2 border-dashed p-4">
              <FormField
                control={hookForm.control}
                name="personalData.dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-start font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Ghanaian"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.sex"
                render={({ field }) => {
                  const options = [
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                  ];
                  return (
                    <FormItem>
                      <FormLabel>Sex</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="eg: Male" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {options.map(({ label, value }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={hookForm.control}
                name="personalData.ghCard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghana card</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: GHA000000000"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.ssnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SSNIT NO</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: 2452740958274572"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.bankers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bankers</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Ecobank"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-sm text-zinc-600">Spouse</p>
            <div className="h-fit space-y-3 border-2 border-dashed p-4">
              <FormField
                control={hookForm.control}
                name="personalData.nameOfSpouse.isMarried"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col justify-center rounded border p-3">
                    <div className="flex h-full items-center justify-between">
                      <FormLabel>Are you married</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Toggle on if you have legal partner
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.nameOfSpouse.surName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spouse surname</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Martinson"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.nameOfSpouse.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spouse first name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Edwin"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.nameOfSpouse.middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spouse middle name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Otu"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.name.otherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spouse other name(s)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Kofi"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-sm text-zinc-600">Contacts</p>
            <div className="h-fit space-y-3 border-2 border-dashed p-4">
              <FormField
                control={hookForm.control}
                name="personalData.contact.postal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: AK-039-5028"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.contact.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: example@usg.com"
                        type="email"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.contact.mobilePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile phone NO</FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="eg: +2332424001111"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.contact.homePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home phone NO</FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="eg: +2332424001111"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.contact.homeTown"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hometown</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Kumasi"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.contact.residentialAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residential address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: 38 Peregrino Braimah ST"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-sm text-zinc-600">Education</p>
            <div className="h-fit space-y-3 border-2 border-dashed p-4">
              <FormField
                control={hookForm.control}
                name="personalData.education.qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualification</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Masters in Computing"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.education.institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Havard University"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-sm text-zinc-600">Next of kin</p>
            <div className="h-fit space-y-3 border-2 border-dashed p-4">
              <FormField
                control={hookForm.control}
                name="personalData.nextOfKin.name.surName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surname</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Surname"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.nextOfKin.name.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: First name"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.nextOfKin.name.middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Middle name"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.nextOfKin.name.otherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Other name"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.nextOfKin.relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Brother"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.nextOfKin.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: 32 Peregrino Braimah ST"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.nextOfKin.phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone NO</FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="eg: +2332424001111"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-sm text-zinc-600">Emergency Contact</p>
            <div className="h-fit space-y-3 border-2 border-dashed p-4">
              <FormField
                control={hookForm.control}
                name="personalData.emmergencyContact.name.surName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surname</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Surname"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.emmergencyContact.name.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: First name"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.emmergencyContact.name.middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Middle name"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.emmergencyContact.name.otherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Other name"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.emmergencyContact.relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: Brother"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.emmergencyContact.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: 32 Peregrino Braimah ST"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={hookForm.control}
                name="personalData.emmergencyContact.phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone NO</FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="eg: +2332424001111"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>
        </Form>
      </ShadcnForm>
    </section>
  );
}
