import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const data = [
  { name: "Moisture", value: 75, color: "#4A7C26" },
  { name: "pH", value: 65, color: "#4A7C26" },
  { name: "Nitrogen", value: 85, color: "#6B9544" },
  { name: "Phosphorus", value: 60, color: "#6B9544" },
  { name: "Potassium", value: 70, color: "#2D5016" },
];

export function SoilMetricsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Soil Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis hide />
              <Bar
                dataKey="value"
                fill="#4A7C26"
                radius={[4, 4, 0, 0]}
                className="transition-all duration-200"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
