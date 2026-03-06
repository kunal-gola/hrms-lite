import { use, useCallback, useMemo, useState } from 'react'
import * as React from "react"

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


export function EmployeeForm({ onFormSubmit, loading, errorMessage }) {

    const INITIAL_FORM = {
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
    };

    const [form, setForm] = useState(INITIAL_FORM);
    const isComplete = useMemo(
        () =>
        form.employee_id.trim() && form.full_name.trim() && form.email.trim() && form.department.trim(),
        [form]
    );

    function resetForm(){
        setForm(INITIAL_FORM);

    }

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function handleSelect(value){
        setForm((prev) => ( { ...prev, ['department']: value}));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        // console.log(
        //     { employee_id: form.employee_id.trim(),
        //     full_name: form.full_name.trim(),
        //     email: form.email.trim(),
        //     department: form.department.trim(),}
        // )
        try {
        await onFormSubmit({
            employee_id: form.employee_id.trim(),
            full_name: form.full_name.trim(),
            email: form.email.trim(),
            department: form.department.trim(),
        });
        setForm(INITIAL_FORM);
        } catch {
        // Keep entered values when submission fails.
        }
    }


  return (
    <Card className="w-full my-2">
      <CardHeader>
        <CardTitle>Add New Employee</CardTitle>
        <CardDescription>
          Enter Derails for new employee.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage ?
            <FieldGroup>
                <ErrorMessage title="Error !" message={errorMessage}/>
            </FieldGroup>
        : null}
        <form id="form-rhf-demo" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field >
                <FieldLabel htmlFor="form-hrms-employee-id">
                Employee Id <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                id="form-hrms-employee-id"
                type="text"
                placeholder="Enter unique Employee ID"
                autoComplete="off"
                onChange={handleChange}
                name="employee_id"
                value={form.employee_id}
                />
                {/* <FieldDescription>
                    Enter a unique employee ID.
                </FieldDescription> */}
            </Field>

            <Field >
                <FieldLabel htmlFor="form-hrms-full_name">
                Full Name <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                id="form-hrms-full_name"
                type="text"
                placeholder="John Smith"
                autoComplete="off"
                onChange={handleChange}
                name="full_name"
                value={form.full_name}
                />
            </Field>

            <Field >
                <FieldLabel htmlFor="form-hrms-email">
                Email <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                id="form-hrms-email"
                type="email"
                placeholder="John_Smith@hrms.com"
                autoComplete="off"
                onChange={handleChange}
                name="email"
                value={form.email}
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="form-hrms-department">
                    Department <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                    id="form-hrms-department"
                    onValueChange={handleSelect}
                    name="department"
                    value={form.department}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Departments</SelectLabel>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="FINANCE/ACCOUNTING">FINANCE/ACCOUNTING</SelectItem>
                        <SelectItem value="OPERATIONS">OPERATIONS</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="R&D">R&D</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
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
          <Button type="submit" form="form-rhf-demo" className="w-full bg-blue-500"
            disabled={!isComplete || loading}
          >
           {loading ? 'Saving...' : 'Add Employee'}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

