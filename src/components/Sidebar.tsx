import {
  Home,
  Leaf,
  Target,
  Cloud,
  Droplet,
  AlertTriangle,
  TestTube, // Added for TestPredict
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const navigation = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Crop Predictor", icon: TestTube, path: "/predict" }, // Added TestPredict
  { name: "Farm Management", icon: Leaf, path: "/farm-management" },
  { name: "Crop Recommendations", icon: Target, path: "/crop-recommendations" },
  { name: "Weather", icon: Cloud, path: "/weather" },
  { name: "Soil Metrics", icon: Droplet, path: "/soil-metrics" },
  { name: "Disease Alerts", icon: AlertTriangle, path: "/disease-alerts" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex h-full w-64 flex-col bg-farm-neutral border-r border-farm-neutral-dark">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-farm-neutral-dark">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-farm-primary">
            <span className="text-sm font-bold text-primary-foreground">F</span>
          </div>
          <span className="text-lg font-semibold text-foreground">
            FARM-GPT
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Button
              key={item.name}
              variant={isActive ? "secondary" : "ghost"}
              onClick={() => handleNavigation(item.path)}
              className={`w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-farm-primary/10 text-farm-primary hover:bg-farm-primary/15"
                  : "text-muted-foreground hover:text-foreground hover:bg-farm-neutral-dark/50"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
