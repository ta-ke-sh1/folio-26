import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Box, Text } from "@mantine/core";
import {
  IconApi,
  IconBrandCSharp,
  IconBrandMongodb,
  IconBrandNextjs,
  IconBrandNodejs,
  IconBrandReact,
  IconBrandTypescript,
  IconBrandVite,
  IconBrandWindows,
  IconBrowser,
  IconChartDots3,
  IconCoffee,
  IconCode,
  IconDatabase,
  IconDeviceDesktopCode,
  IconServer,
  IconSql,
  IconTopologyStar3,
} from "@tabler/icons-react";
import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeChange,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./technology.section.scss";

type Branch = "left" | "right";
const ICONS = {
  api: IconApi,
  browser: IconBrowser,
  csharp: IconBrandCSharp,
  coffee: IconCoffee,
  code: IconCode,
  database: IconDatabase,
  desktopCode: IconDeviceDesktopCode,
  dots: IconChartDots3,
  mongodb: IconBrandMongodb,
  nextjs: IconBrandNextjs,
  nodejs: IconBrandNodejs,
  react: IconBrandReact,
  server: IconServer,
  sql: IconSql,
  topology: IconTopologyStar3,
  typescript: IconBrandTypescript,
  vite: IconBrandVite,
  windows: IconBrandWindows,
} as const;
type TechnologyIconName = keyof typeof ICONS;
type TechnologyNodeData = {
  label: string;
  mark: string;
  variant: "hub" | "category" | "technology";
  branch?: Branch;
  groupId?: string;
  icon: TechnologyIconName;
};
type TechnologyNode = Node<TechnologyNodeData, "technology">;
type Technology = {
  id: string;
  label: string;
  mark: string;
  icon: TechnologyIconName;
  x: number;
  y: number;
};
type TechnologyGroup = {
  id: string;
  label: string;
  mark: string;
  icon: TechnologyIconName;
  x: number;
  y: number;
  branch: Branch;
  children: Technology[];
};

const GROUPS: TechnologyGroup[] = [
  {
    id: "web",
    label: "WEB DEVELOPMENT",
    mark: "</WEB>",
    icon: "browser",
    x: 360,
    y: 225,
    branch: "left",
    children: [
      { id: "react", label: "React", mark: "<RJS>", icon: "react", x: 70, y: 25 },
      { id: "typescript", label: "TypeScript", mark: "{TS}", icon: "typescript", x: 70, y: 105 },
      { id: "nextjs", label: "Next.js", mark: "<NXT>", icon: "nextjs", x: 70, y: 185 },
      { id: "nodejs", label: "Node.js", mark: "{NODE}", icon: "nodejs", x: 70, y: 265 },
      { id: "express", label: "Express", mark: "EX()", icon: "api", x: 70, y: 345 },
      { id: "vite", label: "Vite", mark: "[VITE]", icon: "vite", x: 70, y: 425 },
    ],
  },
  {
    id: "application",
    label: "APPLICATION DEVELOPMENT",
    mark: "[APP]",
    icon: "desktopCode",
    x: 360,
    y: 640,
    branch: "left",
    children: [
      { id: "csharp", label: "C#", mark: "{C#}", icon: "csharp", x: 70, y: 480 },
      { id: "java", label: "Java", mark: "<JAVA>", icon: "coffee", x: 70, y: 560 },
      { id: "dotnet", label: ".NET", mark: "[.NET]", icon: "code", x: 70, y: 640 },
      { id: "javafx", label: "JavaFX", mark: "<JFX>", icon: "desktopCode", x: 70, y: 720 },
      { id: "wpf", label: "WPF", mark: "[WPF]", icon: "windows", x: 70, y: 800 },
    ],
  },
  {
    id: "database",
    label: "DATABASE",
    mark: "[DB]",
    icon: "database",
    x: 800,
    y: 425,
    branch: "right",
    children: [
      { id: "postgresql", label: "PostgreSQL", mark: "[SQL]", icon: "sql", x: 1090, y: 95 },
      { id: "mongodb", label: "MongoDB", mark: "{DOC}", icon: "mongodb", x: 1090, y: 245 },
      { id: "influxdb", label: "InfluxDB", mark: "~TSDB~", icon: "dots", x: 1090, y: 395 },
      { id: "redis", label: "Redis", mark: ":REDIS:", icon: "server", x: 1090, y: 545 },
      { id: "sqlite", label: "SQLite", mark: "[LITE]", icon: "database", x: 1090, y: 695 },
    ],
  },
];

const HUB = { x: 600, y: 425 };
const MOBILE_HUB = { x: 220, y: 40 };
const MOBILE_GROUPS: Record<string, { x: number; y: number }> = {
  web: { x: 220, y: 105 },
  application: { x: 220, y: 245 },
  database: { x: 220, y: 385 },
};
const MOBILE_TECHNOLOGY_COLUMNS = [70, 220, 370];
const MOBILE_TECHNOLOGY_ROW_GAP = 42;
const MOBILE_CATEGORY_WIDTH = 205;
const MOBILE_CATEGORY_HEIGHT = 48;
const MOBILE_HUB_SIZE = 64;
const MOBILE_TECHNOLOGY_WIDTH = 128;
const HUB_SIZE = 112;
const CATEGORY_WIDTH = 250;
const CATEGORY_HEIGHT = 62;
const TECHNOLOGY_WIDTH = 200;
const TECHNOLOGY_HEIGHT = 50;
const MOBILE_BREAKPOINT = "(max-width: 48em)";

function createInitialNodes(isMobile: boolean): TechnologyNode[] {
  const hub = isMobile ? MOBILE_HUB : HUB;
  const hubSize = isMobile ? MOBILE_HUB_SIZE : HUB_SIZE;
  const nodes: TechnologyNode[] = [
    {
      id: "engineering",
      type: "technology",
      position: { x: hub.x - hubSize / 2, y: hub.y - hubSize / 2 },
      data: { label: "ENGINEERING", mark: "CORE", variant: "hub", icon: "topology" },
      draggable: true,
    },
  ];

  GROUPS.forEach((group) => {
    const mobileGroup = MOBILE_GROUPS[group.id];
    const groupX = isMobile ? mobileGroup.x : group.x;
    const groupY = isMobile ? mobileGroup.y : group.y;
    const categoryWidth = isMobile ? MOBILE_CATEGORY_WIDTH : CATEGORY_WIDTH;
    const categoryHeight = isMobile ? MOBILE_CATEGORY_HEIGHT : CATEGORY_HEIGHT;
    nodes.push({
      id: group.id,
      type: "technology",
      position: { x: groupX - categoryWidth / 2, y: groupY - categoryHeight / 2 },
      data: {
        label: group.label,
        mark: group.mark,
        variant: "category",
        branch: group.branch,
        groupId: group.id,
        icon: group.icon,
      },
      draggable: true,
    });

    group.children.forEach((technology, index) => {
      const technologyX = isMobile
        ? MOBILE_TECHNOLOGY_COLUMNS[index % MOBILE_TECHNOLOGY_COLUMNS.length]
        : technology.x;
      const technologyY = isMobile
        ? groupY + 52 + Math.floor(index / MOBILE_TECHNOLOGY_COLUMNS.length) * MOBILE_TECHNOLOGY_ROW_GAP
        : technology.y;
      const technologyWidth = isMobile ? MOBILE_TECHNOLOGY_WIDTH : TECHNOLOGY_WIDTH;
      nodes.push({
        id: technology.id,
        type: "technology",
        position: {
          x: technologyX - technologyWidth / 2,
          y: technologyY - TECHNOLOGY_HEIGHT / 2,
        },
        data: {
          label: technology.label,
          mark: technology.mark,
          variant: "technology",
          branch: group.branch,
          groupId: group.id,
          icon: technology.icon,
        },
        draggable: true,
      });
    });
  });

  return nodes;
}

function createEdges(isMobile: boolean): Edge[] {
  return GROUPS.flatMap((group) => {
    const isLeftBranch = !isMobile && group.branch === "left";
    const categoryTargetHandle = isMobile
      ? "category-input-top"
      : isLeftBranch ? "category-input-right" : "category-input-left";
    const categorySourceHandle = isMobile
      ? "category-output-bottom"
      : isLeftBranch ? "category-output-left" : "category-output-right";
    const technologyTargetHandle = isMobile
      ? "technology-input-top"
      : isLeftBranch ? "technology-input-right" : "technology-input-left";

    return [
      {
        id: `engineering-${group.id}`,
        source: "engineering",
        sourceHandle: isMobile ? "hub-output-bottom" : isLeftBranch ? "hub-output-left" : "hub-output-right",
        target: group.id,
        targetHandle: categoryTargetHandle,
        type: "default" as const,
        animated: true,
        className: "technology-flow__edge technology-flow__edge--hub",
        data: { groupId: group.id },
      },
      ...group.children.map((technology) => ({
        id: `${group.id}-${technology.id}`,
        source: group.id,
        sourceHandle: categorySourceHandle,
        target: technology.id,
        targetHandle: technologyTargetHandle,
        type: "default" as const,
        animated: true,
        className: "technology-flow__edge",
        data: { groupId: group.id },
      })),
    ];
  });
}

function TechnologyFlowNode({ data }: NodeProps<TechnologyNode>) {
  const isHub = data.variant === "hub";
  const isCategory = data.variant === "category";
  const Icon = ICONS[data.icon];

  return (
    <div className={`technology-node technology-node--${data.variant}`} aria-label={`${data.label}${isHub ? " core" : ""}`}>
      {isHub ? (
        <>
          <Handle id="hub-output-left" type="source" position={Position.Left} className="technology-node__handle" />
          <Handle id="hub-output-right" type="source" position={Position.Right} className="technology-node__handle" />
          <Handle id="hub-output-bottom" type="source" position={Position.Bottom} className="technology-node__handle" />
          <span className="technology-node__hub-heading">
            <Icon className="technology-node__icon" size={17} stroke={1.7} aria-hidden="true" />
            <span className="technology-node__hub-mark">{data.mark}</span>
          </span>
          <span className="technology-node__hub-label">{data.label}</span>
        </>
      ) : (
        <>
          {isCategory && <Handle id="category-input-top" type="target" position={Position.Top} className="technology-node__handle" />}
          {isCategory && <Handle id="category-input-left" type="target" position={Position.Left} className="technology-node__handle" />}
          {isCategory && <Handle id="category-input-right" type="target" position={Position.Right} className="technology-node__handle" />}
          {isCategory && <Handle id="category-output-left" type="source" position={Position.Left} className="technology-node__handle" />}
          {isCategory && <Handle id="category-output-right" type="source" position={Position.Right} className="technology-node__handle" />}
          {isCategory && <Handle id="category-output-bottom" type="source" position={Position.Bottom} className="technology-node__handle" />}
          {!isCategory && <Handle id="technology-input-top" type="target" position={Position.Top} className="technology-node__handle" />}
          {!isCategory && <Handle id="technology-input-left" type="target" position={Position.Left} className="technology-node__handle" />}
          {!isCategory && <Handle id="technology-input-right" type="target" position={Position.Right} className="technology-node__handle" />}
          <Icon className="technology-node__icon" size={17} stroke={1.7} aria-hidden="true" />
          <span className="technology-node__mark">{data.mark}</span>
          <span className="technology-node__label">{data.label}</span>
        </>
      )}
    </div>
  );
}

const NODE_TYPES: NodeTypes = { technology: TechnologyFlowNode };

export function TechnologySection() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_BREAKPOINT).matches);
  const [nodes, setNodes] = useState<TechnologyNode[]>(() => createInitialNodes(window.matchMedia(MOBILE_BREAKPOINT).matches));
  const [activeBranch, setActiveBranch] = useState<string | "all" | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
    const updateLayout = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
      setNodes(createInitialNodes(event.matches));
      setActiveBranch(null);
    };

    mediaQuery.addEventListener("change", updateLayout);
    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  const edges = useMemo(() => createEdges(isMobile), [isMobile]);
  const onNodesChange = useCallback((changes: NodeChange<TechnologyNode>[]) => {
    setNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
  }, []);
  const displayedNodes = useMemo(() => nodes.map((node) => {
    if (!activeBranch) return { ...node, className: "" };
    const inActiveBranch = activeBranch === "all" || node.id === "engineering" || node.data.groupId === activeBranch;
    return { ...node, className: inActiveBranch ? "is-branch-active" : "is-branch-dimmed" };
  }), [nodes, activeBranch]);
  const displayedEdges = useMemo(() => edges.map((edge) => {
    if (!activeBranch) return edge;
    const inActiveBranch = activeBranch === "all" || edge.data?.groupId === activeBranch;
    return {
      ...edge,
      className: `technology-flow__edge${edge.className?.includes("--hub") ? " technology-flow__edge--hub" : ""}${inActiveBranch ? " is-branch-active" : " is-branch-dimmed"}`,
    };
  }), [edges, activeBranch]);

  return (
    <section className="technology-section" aria-labelledby="technology-heading">
      <div className="technology-section__header">
        <div>
          <Badge size="lg" variant="dot" color="primaryOrange">
            IV. TECHNOLOGY NETWORK
          </Badge>
          <Text id="technology-heading" component="h2" className="technology-section__title">
            TOOLS THAT CONNECT IDEAS.
          </Text>
        </div>
        <Text className="technology-section__instruction">
          {isMobile ? "VERTICAL TECHNOLOGY MAP" : "DRAG NODES TO REARRANGE // PINCH TO ZOOM"}
        </Text>
      </div>

      <Box className="technology-graph" aria-label="Interactive graph of development and database technologies">
        <ReactFlow<TechnologyNode>
          key={isMobile ? "mobile-layout" : "desktop-layout"}
          className={`technology-flow${isMobile ? " technology-flow--mobile" : ""}`}
          nodes={displayedNodes}
          edges={displayedEdges}
          nodeTypes={NODE_TYPES}
          onNodesChange={onNodesChange}
          fitView
          fitViewOptions={{ padding: isMobile ? 0.025 : 0.08, minZoom: isMobile ? 0.52 : 0.52, maxZoom: 1.1 }}
          minZoom={0.4}
          maxZoom={1.6}
          nodesDraggable={!isMobile}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={!isMobile}
          zoomOnScroll={false}
          zoomOnPinch={!isMobile}
          zoomOnDoubleClick={!isMobile}
          preventScrolling={!isMobile}
          proOptions={{ hideAttribution: true }}
          onNodeMouseEnter={(_, node) => setActiveBranch(node.id === "engineering" ? "all" : node.data.groupId ?? null)}
          onNodeMouseLeave={() => setActiveBranch(null)}
        >
          <Background variant={BackgroundVariant.Lines} gap={40} size={1} color="var(--folio-flow-line)" />
        </ReactFlow>
        <div className="technology-graph__legend" aria-hidden="true">
          <span><i className="technology-graph__legend-dot" /> ACTIVE SYSTEM</span>
          <span>19 NODES // 18 LINKS</span>
        </div>
      </Box>
    </section>
  );
}
