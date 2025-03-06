"use client"

import { useState, useEffect } from "react"
import type { Node } from "reactflow"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"

interface NodePropertiesProps {
  selectedNode: Node | null
  onNodeUpdate: (nodeId: string, newData: any) => void
}

export default function NodeProperties({ selectedNode, onNodeUpdate }: NodePropertiesProps) {
  const [localData, setLocalData] = useState<any>(null)

  // Update local data when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setLocalData({ ...selectedNode.data })
    } else {
      setLocalData(null)
    }
  }, [selectedNode])

  // Handle changes to node properties
  const handleChange = (key: string, value: any) => {
    if (!selectedNode) return

    const newData = { ...localData, [key]: value }
    setLocalData(newData)
    onNodeUpdate(selectedNode.id, newData)
  }

  // Handle changes to nested properties
  const handleNestedChange = (parentKey: string, index: number, key: string, value: any) => {
    if (!selectedNode || !localData[parentKey]) return

    const newArray = [...localData[parentKey]]
    newArray[index] = { ...newArray[index], [key]: value }

    handleChange(parentKey, newArray)
  }

  // Add a new item to an array property
  const handleAddItem = (key: string, defaultItem: any) => {
    if (!selectedNode) return

    const newArray = localData[key] ? [...localData[key], defaultItem] : [defaultItem]
    handleChange(key, newArray)
  }

  // Remove an item from an array property
  const handleRemoveItem = (key: string, index: number) => {
    if (!selectedNode || !localData[key]) return

    const newArray = [...localData[key]]
    newArray.splice(index, 1)
    handleChange(key, newArray)
  }

  if (!selectedNode || !localData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Node Properties</CardTitle>
          <CardDescription>Select a node to view and edit its properties</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Render API node properties
  if (selectedNode.type === "apiNode") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Node Properties</CardTitle>
          <CardDescription>Configure the API endpoint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input id="label" value={localData.label || ""} onChange={(e) => handleChange("label", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <Select value={localData.method || "GET"} onValueChange={(value) => handleChange("method", value)}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input id="url" value={localData.url || ""} onChange={(e) => handleChange("url", e.target.value)} />
            </div>

            <Tabs defaultValue="params">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="params">Parameters</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
                <TabsTrigger value="body">Body</TabsTrigger>
              </TabsList>

              <TabsContent value="params" className="space-y-4 pt-4">
                {localData.params &&
                  localData.params.map((param: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Key"
                        value={param.key || ""}
                        onChange={(e) => handleNestedChange("params", index, "key", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={param.value || ""}
                        onChange={(e) => handleNestedChange("params", index, "value", e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem("params", index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddItem("params", { key: "", value: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Parameter
                </Button>
              </TabsContent>

              <TabsContent value="headers" className="space-y-4 pt-4">
                {localData.headers &&
                  localData.headers.map((header: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Key"
                        value={header.key || ""}
                        onChange={(e) => handleNestedChange("headers", index, "key", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={header.value || ""}
                        onChange={(e) => handleNestedChange("headers", index, "value", e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem("headers", index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddItem("headers", { key: "", value: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Header
                </Button>
              </TabsContent>

              <TabsContent value="body" className="space-y-4 pt-4">
                <Textarea
                  placeholder="Request body (JSON)"
                  value={localData.body ? JSON.stringify(localData.body, null, 2) : ""}
                  onChange={(e) => {
                    try {
                      const bodyObj = JSON.parse(e.target.value)
                      handleChange("body", bodyObj)
                    } catch (error) {
                      // Keep the raw text even if it's not valid JSON
                      // This allows users to edit without validation errors
                    }
                  }}
                  className="min-h-[150px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Use $.fieldName to reference values from previous nodes
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render transform node properties
  if (selectedNode.type === "transformNode") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transform Node Properties</CardTitle>
          <CardDescription>Configure data transformations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input id="label" value={localData.label || ""} onChange={(e) => handleChange("label", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Transformations</Label>
              {localData.transformations &&
                localData.transformations.map((transform: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <Input
                      placeholder="Source path"
                      value={transform.source || ""}
                      onChange={(e) => handleNestedChange("transformations", index, "source", e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-muted-foreground">→</span>
                    <Input
                      placeholder="Target field"
                      value={transform.target || ""}
                      onChange={(e) => handleNestedChange("transformations", index, "target", e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem("transformations", index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => handleAddItem("transformations", { source: "", target: "" })}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Transformation
              </Button>
            </div>

            {localData.code !== undefined && (
              <div className="space-y-2">
                <Label htmlFor="code">Custom Code</Label>
                <Textarea
                  id="code"
                  value={localData.code || ""}
                  onChange={(e) => handleChange("code", e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                  placeholder="// Write custom JavaScript to transform the data
// Input data is available as 'input'
// Return the transformed data
return input;"
                />
              </div>
            )}

            {localData.conditions !== undefined && (
              <div className="space-y-2">
                <Label>Conditions</Label>
                {localData.conditions &&
                  localData.conditions.map((condition: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 mt-2">
                      <Input
                        placeholder="Field"
                        value={condition.field || ""}
                        onChange={(e) => handleNestedChange("conditions", index, "field", e.target.value)}
                        className="flex-1"
                      />
                      <Select
                        value={condition.operator || "equals"}
                        onValueChange={(value) => handleNestedChange("conditions", index, "operator", value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">equals</SelectItem>
                          <SelectItem value="notEquals">not equals</SelectItem>
                          <SelectItem value="contains">contains</SelectItem>
                          <SelectItem value="greaterThan">greater than</SelectItem>
                          <SelectItem value="lessThan">less than</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Value"
                        value={condition.value || ""}
                        onChange={(e) => handleNestedChange("conditions", index, "value", e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem("conditions", index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => handleAddItem("conditions", { field: "", operator: "equals", value: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Condition
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Fallback for unknown node types
  return (
    <Card>
      <CardHeader>
        <CardTitle>Node Properties</CardTitle>
        <CardDescription>Configure node properties</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={localData.label || ""} onChange={(e) => handleChange("label", e.target.value)} />
        </div>
      </CardContent>
    </Card>
  )
}

