"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Search, Globe, ArrowRightLeft, Database, Code, Filter } from "lucide-react"

// Node templates
const nodeTemplates = [
  {
    type: "apiNode",
    category: "API",
    title: "REST API",
    description: "Make HTTP requests to REST APIs",
    icon: <Globe className="h-8 w-8 text-blue-500" />,
    data: {
      label: "REST API",
      method: "GET",
      url: "https://api.example.com/data",
      params: [],
      headers: [{ key: "Content-Type", value: "application/json" }],
    },
  },
  {
    type: "transformNode",
    category: "Transformation",
    title: "Data Mapper",
    description: "Map data between different formats",
    icon: <ArrowRightLeft className="h-8 w-8 text-green-500" />,
    data: {
      label: "Data Mapper",
      transformations: [],
    },
  },
  {
    type: "apiNode",
    category: "API",
    title: "GraphQL API",
    description: "Make GraphQL queries and mutations",
    icon: <Database className="h-8 w-8 text-purple-500" />,
    data: {
      label: "GraphQL API",
      method: "POST",
      url: "https://api.example.com/graphql",
      params: [],
      headers: [{ key: "Content-Type", value: "application/json" }],
      body: { query: "" },
    },
  },
  {
    type: "transformNode",
    category: "Transformation",
    title: "Filter",
    description: "Filter data based on conditions",
    icon: <Filter className="h-8 w-8 text-orange-500" />,
    data: {
      label: "Filter",
      transformations: [],
      conditions: [{ field: "", operator: "equals", value: "" }],
    },
  },
  {
    type: "transformNode",
    category: "Transformation",
    title: "Code",
    description: "Custom JavaScript transformations",
    icon: <Code className="h-8 w-8 text-yellow-500" />,
    data: {
      label: "Custom Code",
      code: "// Example: return { ...input, transformed: true };\nreturn input;",
    },
  },
]

export default function NodeLibrary() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter nodes based on search term
  const filteredNodes = nodeTemplates.filter(
    (node) =>
      node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Group nodes by category
  const groupedNodes = filteredNodes.reduce(
    (acc, node) => {
      if (!acc[node.category]) {
        acc[node.category] = []
      }
      acc[node.category].push(node)
      return acc
    },
    {} as Record<string, typeof nodeTemplates>,
  )

  // Handle drag start
  const onDragStart = (event: React.DragEvent, nodeType: string, nodeData: any) => {
    event.dataTransfer.setData("application/reactflow/type", nodeType)
    event.dataTransfer.setData("application/reactflow/data", JSON.stringify(nodeData))
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-2">Node Library</h2>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search nodes..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-y-auto flex-1 pr-1 -mr-1">
        {Object.entries(groupedNodes).map(([category, nodes]) => (
          <div key={category} className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{category}</h3>
            <div className="space-y-2">
              {nodes.map((node, index) => (
                <div
                  key={`${category}-${index}`}
                  className="cursor-grab rounded-md border bg-card p-3 hover:border-primary transition-colors"
                  draggable
                  onDragStart={(event) => onDragStart(event, node.type, node.data)}
                >
                  <div className="flex items-center gap-3">
                    {node.icon}
                    <div>
                      <h4 className="text-sm font-medium">{node.title}</h4>
                      <p className="text-xs text-muted-foreground">{node.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="mt-4" />
          </div>
        ))}
      </div>
    </div>
  )
}

