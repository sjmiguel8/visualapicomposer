"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Panel,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Play, Save, Download } from "lucide-react"
import ApiNode from "@/components/nodes/api-node"
import TransformNode from "@/components/nodes/transform-node"
import NodeLibrary from "@/components/node-library"
import NodeProperties from "@/components/node-properties"
import ExecutionPanel from "@/components/execution-panel"

// Define custom node types
const nodeTypes: NodeTypes = {
  apiNode: ApiNode,
  transformNode: TransformNode,
}

// Initial nodes and edges for demo
const initialNodes: Node[] = [
  {
    id: "1",
    type: "apiNode",
    position: { x: 250, y: 100 },
    data: {
      label: "Weather API",
      method: "GET",
      url: "https://api.weatherapi.com/v1/current.json",
      params: [
        { key: "q", value: "London" },
        { key: "key", value: "YOUR_API_KEY" },
      ],
      headers: [{ key: "Content-Type", value: "application/json" }],
    },
  },
  {
    id: "2",
    type: "transformNode",
    position: { x: 250, y: 300 },
    data: {
      label: "Extract Temperature",
      transformations: [
        { source: "current.temp_c", target: "temperature" },
        { source: "location.name", target: "city" },
      ],
    },
  },
  {
    id: "3",
    type: "apiNode",
    position: { x: 250, y: 500 },
    data: {
      label: "Storage API",
      method: "POST",
      url: "https://api.example.com/store",
      params: [],
      headers: [{ key: "Content-Type", value: "application/json" }],
      body: { temperature: "$.temperature", location: "$.city" },
    },
  },
]

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
]

export default function WorkflowBuilder() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderContent />
    </ReactFlowProvider>
  )
}

function WorkflowBuilderContent() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [executionResults, setExecutionResults] = useState<any[]>([])
  const [isExecuting, setIsExecuting] = useState(false)

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  )

  // Handle node selection
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node)
    },
    [setSelectedNode],
  )

  // Handle node deselection
  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [setSelectedNode])

  // Handle node updates
  const onNodeUpdate = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            }
          }
          return node
        }),
      )
    },
    [setNodes],
  )

  // Handle drag over for new nodes
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  // Handle drop for new nodes
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowWrapper.current) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData("application/reactflow/type")
      const nodeData = JSON.parse(event.dataTransfer.getData("application/reactflow/data"))

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }

      // Create a new node
      const newNode: Node = {
        id: `node_${Date.now()}`,
        type,
        position,
        data: nodeData,
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [setNodes],
  )

  // Execute the workflow
  const executeWorkflow = useCallback(async () => {
    setIsExecuting(true)
    setExecutionResults([])

    try {
      // In a real application, this would send the workflow to the backend
      // For demo purposes, we'll simulate the execution
      const sortedNodes = [...nodes].sort((a, b) => {
        // Simple topological sort based on y-position
        return a.position.y - b.position.y
      })

      let currentData = {}
      const results = []

      for (const node of sortedNodes) {
        // Simulate API call or transformation
        if (node.type === "apiNode") {
          // Simulate API response
          const result = {
            nodeId: node.id,
            label: node.data.label,
            type: "API Call",
            request: {
              method: node.data.method,
              url: node.data.url,
              params: node.data.params,
              headers: node.data.headers,
            },
            response: {
              status: 200,
              data:
                node.id === "1"
                  ? {
                      location: { name: "London", country: "UK" },
                      current: { temp_c: 18.5, condition: { text: "Partly cloudy" } },
                    }
                  : { success: true, message: "Data stored successfully" },
            },
          }
          currentData = { ...currentData, ...result.response.data }
          results.push(result)
        } else if (node.type === "transformNode") {
          // Apply transformations
          const transformations = node.data.transformations
          const transformedData: Record<string, any> = {}

          transformations.forEach((t: { source: string; target: string }) => {
            // Simple path-based extraction
            const value = t.source.split(".").reduce((obj, key) => obj?.[key], currentData)
            transformedData[t.target] = value
          })

          const result = {
            nodeId: node.id,
            label: node.data.label,
            type: "Transformation",
            input: currentData,
            output: transformedData,
            transformations: transformations,
          }

          currentData = { ...currentData, ...transformedData }
          results.push(result)
        }
      }

      setExecutionResults(results)
      toast.success("Workflow executed successfully")
    } catch (error) {
      console.error("Workflow execution failed:", error)
      toast.error("Workflow execution failed")
    } finally {
      setIsExecuting(false)
    }
  }, [nodes])

  // Save the workflow
  const saveWorkflow = useCallback(() => {
    const workflow = { nodes, edges }
    localStorage.setItem("workflow", JSON.stringify(workflow))
    toast.success("Workflow saved successfully")
  }, [nodes, edges])

  // Export the workflow
  const exportWorkflow = useCallback(() => {
    const workflow = { nodes, edges }
    const dataStr = JSON.stringify(workflow, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `workflow-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }, [nodes, edges])

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left sidebar - Node library */}
      <div className="w-64 border-r bg-muted/40 p-4">
        <NodeLibrary />
      </div>

      {/* Main canvas */}
      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          onDragOver={onDragOver}
          onDrop={onDrop}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
          <Panel position="top-right" className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={executeWorkflow}
              disabled={isExecuting}
              className="flex items-center gap-1"
            >
              <Play className="h-4 w-4" />
              Run
            </Button>
            <Button variant="outline" size="sm" onClick={saveWorkflow} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={exportWorkflow} className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </Panel>
        </ReactFlow>
      </div>

      {/* Right sidebar - Properties and execution */}
      <div className="w-96 border-l bg-muted/40 p-4">
        <Tabs defaultValue="properties">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
          </TabsList>
          <TabsContent value="properties" className="mt-4">
            <NodeProperties selectedNode={selectedNode} onNodeUpdate={onNodeUpdate} />
          </TabsContent>
          <TabsContent value="execution" className="mt-4">
            <ExecutionPanel results={executionResults} isExecuting={isExecuting} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

