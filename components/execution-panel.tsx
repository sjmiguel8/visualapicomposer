"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface ExecutionPanelProps {
  results: any[]
  isExecuting: boolean
}

export default function ExecutionPanel({ results, isExecuting }: ExecutionPanelProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Execution Results</CardTitle>
            {isExecuting && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Running
              </Badge>
            )}
          </div>
          <CardDescription>
            {results.length > 0
              ? `${results.length} node${results.length > 1 ? "s" : ""} executed`
              : "Run the workflow to see results"}
          </CardDescription>
        </CardHeader>
        {results.length > 0 && (
          <CardContent className="p-0">
            <Accordion type="multiple" className="w-full">
              {results.map((result, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="px-4 py-2 text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-normal">
                        {result.type}
                      </Badge>
                      <span>{result.label}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3 pt-1">
                    <div className="rounded-md bg-muted p-3">
                      <pre className="text-xs overflow-auto max-h-[300px]">{JSON.stringify(result, null, 2)}</pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

