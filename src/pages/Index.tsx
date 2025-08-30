import { Sidebar } from "../components/Sidebar";
import { Dashboard } from "./Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar />
        <Dashboard />
      </div>
    </div>
  );
};

export default Index;
