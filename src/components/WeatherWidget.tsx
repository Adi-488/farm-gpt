import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Sun, Cloud } from "lucide-react";

export function WeatherWidget() {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Sun className="h-6 w-6 text-yellow-500" />
              <Cloud className="h-5 w-5 text-gray-400 -ml-1" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sunny</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">72°F</div>
            <div className="text-sm text-muted-foreground">75° / 68°</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
