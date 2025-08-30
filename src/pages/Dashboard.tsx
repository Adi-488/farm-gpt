import { MetricCard } from "../components/MetricCard";
import { WeatherWidget } from "../components/WeatherWidget";
import { SoilMetricsChart } from "../components/SoilMetricsChart";
import { EngineCard } from "../components/EngineCard";
import {
  Home,
  Sprout,
  Droplets,
  Shield,
  AlertTriangle,
  TrendingUp,
  MapPin,
} from "lucide-react";
import farmHeroImage from "../assets/farm-image.jpeg";

export function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-6 bg-background min-h-screen overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your farm overview.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Last updated</div>
          <div className="text-sm font-medium text-foreground">
            2 minutes ago
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Farms"
          value="3"
          subtitle="2 active, 1 preparing"
          icon={Home}
        />
        <MetricCard
          title="Active Crops"
          value="8"
          subtitle="Corn, Soybeans, Wheat"
          icon={Sprout}
        />
        <MetricCard
          title="Water Efficiency"
          value="94%"
          subtitle="+2% from last week"
          icon={Droplets}
          trend="up"
        />
        <MetricCard
          title="Disease Alerts"
          value="1"
          subtitle="1 low risk detected"
          icon={AlertTriangle}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Farm Management */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Farm Management
            </h2>
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={farmHeroImage}
                alt="Farm field view"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm font-medium">Field A-1</p>
                <p className="text-xs opacity-90">Corn - Growth Stage V6</p>
              </div>
            </div>
          </div>

          <WeatherWidget />
        </div>

        {/* Middle Column - Crop Recommendations */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Crop Recommendations
            </h2>
            <div className="bg-gradient-to-br from-farm-primary/5 to-farm-secondary/5 border border-farm-neutral-dark rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg bg-farm-primary/10">
                  <Sprout className="h-6 w-6 text-farm-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Recommended Crop
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    For next rotation
                  </p>
                </div>
              </div>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-farm-primary mb-2">
                  CORN
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>+15% yield potential</span>
                </div>
              </div>
            </div>
          </div>

          <SoilMetricsChart />
        </div>

        {/* Right Column - Disease Alerts & AI Engines */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Disease Alerts
            </h2>
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                  1 alert
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Low risk detected in Field B-2
                </p>
              </div>
            </div>
          </div>

          {/* AI Engines Status */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              AI Engines
            </h2>
            <div className="space-y-3">
              <EngineCard
                title="CropPlanner"
                description="Optimizing crop rotation schedule"
                icon={Sprout}
                status="active"
                lastUpdate="5 minutes ago"
              />
              <EngineCard
                title="AquaSense"
                description="Monitoring irrigation systems"
                icon={Droplets}
                status="processing"
                lastUpdate="12 minutes ago"
              />
              <EngineCard
                title="NutriGuide"
                description="Analyzing soil nutrition data"
                icon={MapPin}
                status="active"
                lastUpdate="8 minutes ago"
              />
              <EngineCard
                title="ShieldVision AI"
                description="Scanning for pest detection"
                icon={Shield}
                status="idle"
                lastUpdate="1 hour ago"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
