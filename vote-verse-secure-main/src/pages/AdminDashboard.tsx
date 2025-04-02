
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { getElections, getVotesForElection } from "@/utils/electionUtils";
import { CalendarDays, Clock, PlusCircle, Users, Vote } from "lucide-react";

const AdminDashboard = () => {
  const elections = getElections();

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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Link to="/admin/create-election">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Election
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Elections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{elections.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Elections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {elections.filter(e => e.status === "active").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Votes Cast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {elections.reduce(
                  (total, election) => 
                    total + getVotesForElection(election.id).length, 
                  0
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Manage Elections</h2>

        <div className="space-y-6">
          {elections.map((election) => {
            const votes = getVotesForElection(election.id);
            
            return (
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
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Votes: {votes.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-row lg:flex-col items-center justify-between gap-4 bg-muted/50 lg:w-64">
                    <Link to={`/results/${election.id}`} className="w-full">
                      <Button variant="default" className="w-full">
                        View Results
                      </Button>
                    </Link>
                    <Link to={`/election/${election.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        View Ballot
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}

          {elections.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No elections created yet.</p>
              <Link to="/admin/create-election">
                <Button>Create Your First Election</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
