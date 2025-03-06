import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe } from "lucide-react"

const ApiNode = memo(({ data, isConnectable, selected }: NodeProps) => {
  const { label, method, url } = data

  return (
    <Card className={`w-64 shadow-md ${selected ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="p-3 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {method}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <p className="text-xs text-muted-foreground truncate" title={url}>
          {url}
        </p>
      </CardContent>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-primary" />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-primary" />
    </Card>
  )
})

ApiNode.displayName = "ApiNode"

export default ApiNode

