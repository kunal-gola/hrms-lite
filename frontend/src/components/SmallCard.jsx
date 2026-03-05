import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardSmall({title, description, children, showfooter}) {
  return (
    <Card size="sm" className="mx-auto w-full my-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        { description != null ? 
            <CardDescription>
            {description}
            </CardDescription>
            : null
        }
      </CardHeader>
      {children ? 
        <CardContent className="block md:flex p-4 gap-4">
            {children}
        </CardContent>
      : null}
      {showfooter ? 
        <CardFooter>
            {/* <Button variant="outline" size="sm" className="w-full">
            Action
            </Button> */}
        </CardFooter>
      : null}
    </Card>
  )
}
