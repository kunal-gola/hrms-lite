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
import { Badge } from "@/components/ui/badge"

export function AttendanceTable({ attendances }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Date</TableHead>
          <TableHead className="font-bold">Employee ID</TableHead>
          <TableHead className="font-bold">Name</TableHead>
          <TableHead className="font-bold">Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {attendances.length === 0 ?
            <TableRow>
                <TableCell colspan="4">
                <div className="p-4 text-xl">
                    No Records Found.
                </div>
                </TableCell>
            </TableRow>
        :
        attendances.map( record => {
            return (
                <TableRow key={record['employee_id']}>
                    <TableCell className="text-left font-medium">{record['date']}</TableCell>
                    <TableCell className="text-left">{record['employee_id']}</TableCell>
                    <TableCell className="text-left">{record['full_name']}</TableCell>
                    <TableCell className="text-left">
                        {record['status'] == 'PRESENT' ?
                            <Badge className="bg-green-500 text-white">{record['status']}</Badge>
                        : 
                            <Badge variant="destructive">{record['status']}</Badge>
                        }
                    </TableCell>
                </TableRow>
            )
        })}
      </TableBody>
    </Table>
  )
}
