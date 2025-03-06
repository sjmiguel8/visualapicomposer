import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRightLeft } from "lucide-react"

const TransformNode = memo(({ data, isConnectable, selected }: NodeProps) => {
  const { label, transformations = [] } = data

  return (
    <Card className={`w-64 shadow-md ${selected ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="p-3 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-green-500" />
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            Transform
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <p className="text-xs text-muted-foreground">
          {transformations.length > 0
            ? `${transformations.length} transformation${transformations.length > 1 ? "s" : ""}`
            : "No transformations defined"}
        </p>
      </CardContent>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-green-500" />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-green-500" />
    </Card>
  )
})

TransformNode.displayName = "TransformNode"

export default TransformNode

