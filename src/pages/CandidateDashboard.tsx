
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, BarChart3, Vote } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import ProfileTab from "@/components/candidate/ProfileTab";
import ElectionsTab from "@/components/candidate/ElectionsTab";
import ResultsTab from "@/components/candidate/ResultsTab";

const CandidateDashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Candidate Dashboard</h1>
          <div className="bg-muted p-2 rounded-md flex items-center space-x-2">
            <span className="text-muted-foreground">Candidate ID:</span>
            <span className="font-medium">{user?.candidateId}</span>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="profile">
              <UserCircle className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="elections">
              <Vote className="h-4 w-4 mr-2" />
              Elections
            </TabsTrigger>
            <TabsTrigger value="results">
              <BarChart3 className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="elections">
            <ElectionsTab />
          </TabsContent>

          <TabsContent value="results">
            <ResultsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CandidateDashboard;
