import { use, useCallback, useMemo, useState } from 'react'

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"


import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ErrorMessage } from './ErrorMessage'


export function AttendanceForm({ employees, onFormSubmit, loading, errorMessage }) {

    const INITIAL_FORM = {
    employee: '',
    date: '',
    status: '',
    };
    const [form, setForm] = useState(INITIAL_FORM);
    const isComplete = useMemo(() => 
        form.employee && form.date && form.status, 
    [form]);

    function resetForm(){
        setForm(INITIAL_FORM);
    }

    function handleSelect(name, value){
        setForm((prev) => ( { ...prev, [name]: value}));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const dateObj = form.date;
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, "0"); // months start at 0
        const dd = String(dateObj.getDate()).padStart(2, "0");

        const formattedDate = `${yyyy}-${mm}-${dd}`;
        console.log("formattedDate", formattedDate);

        try {
        await onFormSubmit({
            employee_id: form.employee.trim(),
            status: form.status.trim(),
            date: formattedDate,
        });
        setForm(INITIAL_FORM);
        } catch {
        // Keep entered values when submission fails.
        }
    }


  return (
    <Card className="w-full my-2">
      <CardHeader>
        <CardTitle>Record Attendance</CardTitle>
        <CardDescription>
          Mark one attendance per employee per day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage ?
            <FieldGroup>
                <ErrorMessage title="Error !" message={errorMessage}/>
            </FieldGroup>
        : null}
        <form id="form-hrms-attendance" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
                <FieldLabel htmlFor="form-hrms-employee">
                    Employee <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                    id="form-hrms-employee"
                    onValueChange={(value) => handleSelect('employee', value)}
                    name="employee"
                    value={form.employee}
                    disabled={loading || employees.length === 0}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an Employee" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Select Employee</SelectLabel>

                        {employees.map( (emp) => {
                            return (
                                <SelectItem key={emp['employee_id']} value={emp['employee_id']}>{emp['employee_id']} - {emp['full_name']}</SelectItem>
                            )
                        })}
                        
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </Field>

            <Field>
                <FieldLabel>
                    Date <span className="text-destructive">*</span>
                </FieldLabel>
                <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant="outline"
                    data-empty={!form.date}
                    className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                    >
                    {form.date ? format(form.date, "PPP") : <span>Pick a date</span>}
                    <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    mode="single"
                    selected={form.date}
                    onSelect={(value) => handleSelect("date", value)}
                    defaultMonth={form.date}
                    />
                </PopoverContent>
                </Popover>
            </Field>

            <Field>
                <FieldLabel htmlFor="form-hrms-status">
                    Attendance <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                    id="form-hrms-status"
                    onValueChange={(value) => handleSelect('status', value)}
                    name="status"
                    value={form.status}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Attendance" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Attendance</SelectLabel>
                        <SelectItem value="PRESENT">PRESENT</SelectItem>
                        <SelectItem value="ABSENT">ABSENT</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </Field>
          </FieldGroup>
        </form>
        
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
            
          <Button type="button" variant="outline" onClick={resetForm}>
            Reset
          </Button>
          <Button type="submit" form="form-hrms-attendance" className="w-full bg-blue-500"
            disabled={!isComplete || loading}
          >
           {loading ? 'Saving...' : 'Mark Attendance'}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

