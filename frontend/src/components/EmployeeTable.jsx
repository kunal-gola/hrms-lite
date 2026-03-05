import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontalIcon } from "lucide-react"

export function EmployeeTable({ employees, onDelete, deletingEmployeeID, setCurrentSelectedEmployee }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Employee ID</TableHead>
          <TableHead className="font-bold">Name</TableHead>
          <TableHead className="font-bold">Email</TableHead>
          <TableHead className="font-bold">Department</TableHead>
          <TableHead className="font-bold text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>

        {employees.length === 0 ? 
            <TableRow>
                <TableCell colspan="5">
                <div className="p-4 text-xl">
                    No Records Found.
                </div>
                </TableCell>
            </TableRow>
        : 
        employees.map( emp => {
            return (
                <TableRow key={emp['employee_id']}>
                    <TableCell className="text-left font-medium">{emp['employee_id']}</TableCell>
                    <TableCell className="text-left">{emp['full_name']}</TableCell>
                    <TableCell className="text-left">{emp['email']}</TableCell>
                    <TableCell className="text-left">{emp['department']}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontalIcon />
                            <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setCurrentSelectedEmployee(emp['employee_id'])}>View Attendance</DropdownMenuItem>
                            {/* <DropdownMenuItem>Duplicate</DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" variant="destructive"
                                onClick={() => onDelete(emp['employee_id'])}
                            >
                             {deletingEmployeeID == emp['employee_id'] ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            )
        })

        }
      </TableBody>
    </Table>
  )
}
