
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { getElections, hasUserVoted } from "@/utils/electionUtils";
import { CalendarDays, CheckCircle, Clock, Vote, User, FileText } from "lucide-react";

// Mock candidate data
const mockCandidates = [
  {
    id: "CAND001",
    name: "Harini Venkatesan",
    party: "Progress Party",
    position: "City Council",
    bio: "Experienced leader with a passion for community service",
  },
  {
    id: "CAND002",
    name: "Pradeep Manivannan",
    party: "Unity Alliance",
    position: "School Board",
    bio: "Former educator and parent advocate",
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const elections = getElections();
  const [activeTab, setActiveTab] = useState("elections");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "upcoming":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Upcoming</Badge>;
      case "ended":
        return <Badge variant="secondary">Ended</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Voter Dashboard</h1>
          <div className="bg-muted p-2 rounded-md flex items-center space-x-2">
            <span className="text-muted-foreground">Voter ID:</span>
            <span className="font-medium">{user?.voterId}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Elections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {elections.filter(e => e.status === "active").length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary text-secondary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Elections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {elections.filter(e => e.status === "upcoming").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">My Participation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {elections.filter(e => hasUserVoted(user?.id || "", e.id)).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="elections" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="elections">
              <Vote className="h-4 w-4 mr-2" />
              Elections
            </TabsTrigger>
            <TabsTrigger value="candidates">
              <User className="h-4 w-4 mr-2" />
              Candidates
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="elections">
            <h2 className="text-2xl font-semibold mb-4">Available Elections</h2>
            <div className="space-y-6">
              {elections.map((election) => (
                <Card key={election.id} className="vote-card overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    <div className="flex-1 p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{election.title}</h3>
                        {getStatusBadge(election.status)}
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {election.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span>Start: {formatDate(election.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>End: {formatDate(election.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Vote className="h-4 w-4 text-muted-foreground" />
                          <span>Candidates: {election.candidates.length}</span>
                        </div>
                        {hasUserVoted(user?.id || "", election.id) && (
                          <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle className="h-4 w-4" />
                            <span>You have voted</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-6 flex flex-row lg:flex-col items-center justify-between bg-muted/50 lg:w-64">
                      {election.status === "active" && !hasUserVoted(user?.id || "", election.id) && (
                        <Link to={`/election/${election.id}`}>
                          <Button className="w-full">
                            Vote Now
                          </Button>
                        </Link>
                      )}
                      
                      {hasUserVoted(user?.id || "", election.id) || election.status === "ended" ? (
                        <Link to={`/results/${election.id}`}>
                          <Button variant={election.status === "ended" ? "default" : "outline"} className="w-full">
                            View Results
                          </Button>
                        </Link>
                      ) : election.status === "upcoming" ? (
                        <Button disabled className="w-full">
                          Not Started Yet
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </Card>
              ))}

              {elections.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No elections available at the moment.</p>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="candidates">
            <h2 className="text-2xl font-semibold mb-4">Candidate Profiles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCandidates.map((candidate) => (
                <Card key={candidate.id} className="overflow-hidden">
                  <div className="aspect-[4/3] bg-muted">
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-16 w-16 text-muted-foreground" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{candidate.name}</CardTitle>
                    <CardDescription>
                      {candidate.party} • {candidate.position}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2">
                      {candidate.bio}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/candidate/${candidate.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
