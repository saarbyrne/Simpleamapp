import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  TrendingUp, 
  Target,
  Brain,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "../../lib/date-utils";
import { Insight } from "./types";

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const iconMap = {
    trend: TrendingUp,
    suggestion: Brain,
    alert: AlertCircle,
    achievement: CheckCircle,
  };
  
  const colorMap = {
    trend: "text-blue-500",
    suggestion: "text-purple-500", 
    alert: "text-orange-500",
    achievement: "text-green-500",
  };

  const Icon = iconMap[insight.type];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={`h-5 w-5 ${colorMap[insight.type]} shrink-0 mt-0.5`} />
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{insight.title}</h4>
              <Badge 
                variant={insight.priority === "high" ? "destructive" : 
                       insight.priority === "medium" ? "default" : "secondary"}
                className="text-xs"
              >
                {insight.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{insight.description}</p>
            {insight.actionItems && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Action Items:</p>
                <ul className="space-y-1">
                  {insight.actionItems.map((item, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                      <Target className="h-3 w-3 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>{insight.category}</span>
              <span>{formatDistanceToNow(insight.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}