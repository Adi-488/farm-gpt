import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import type { LucideIcon } from "lucide-react";

interface EngineCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status: "active" | "idle" | "processing";
  lastUpdate?: string;
}

export function EngineCard({
  title,
  description,
  icon: Icon,
  status,
  lastUpdate,
}: EngineCardProps) {
  const statusColors = {
    active: "text-success",
    idle: "text-muted-foreground",
    processing: "text-warning",
  };

  const statusLabels = {
    active: "Active",
    idle: "Idle",
    processing: "Processing",
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md border-farm-neutral-dark/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-farm-primary/10">
              <Icon className="h-5 w-5 text-farm-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                {title}
              </CardTitle>
              <p className={`text-xs font-medium ${statusColors[status]}`}>
                {statusLabels[status]}
              </p>
            </div>
          </div>
          <div
            className={`h-2 w-2 rounded-full ${
              status === "active"
                ? "bg-success"
                : status === "processing"
                ? "bg-warning"
                : "bg-muted"
            }`}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        {lastUpdate && (
          <p className="text-xs text-muted-foreground">
            Last update: {lastUpdate}
          </p>
        )}
        <Button variant="outline" size="sm" className="w-full">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
