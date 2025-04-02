
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";
import { getElectionById, getElectionResults } from "@/utils/electionUtils";
import { useAuth } from "@/contexts/AuthContext";

interface ElectionResult {
  election: ReturnType<typeof getElectionById>;
  totalVotes: number;
  results: {
    candidate: {
      id: string;
      name: string;
      description: string;
    };
    votes: number;
    percentage: number;
  }[];
}

const Results = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [results, setResults] = useState<ElectionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/dashboard");
      return;
    }

    try {
      const election = getElectionById(id);
      if (!election) {
        toast({
          title: "Election Not Found",
          description: "The election you are looking for does not exist",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      if (election.status === "upcoming" && !isAdmin) {
        toast({
          title: "Results Not Available",
          description: "Results will be available after the election starts",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      const electionResults = getElectionResults(id);
      setResults(electionResults);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load election results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, navigate, toast, isAdmin]);

  if (loading || !results) {
    return (
      <Layout>
        <div className="container mx-auto max-w-3xl text-center py-12">
          Loading results...
        </div>
      </Layout>
    );
  }

  const { election, totalVotes, results: candidateResults } = results;

  // Sort results by votes (highest first)
  const sortedResults = [...candidateResults].sort((a, b) => b.votes - a.votes);
  
  // Identify the winner(s) - handle tie cases
  const highestVotes = sortedResults[0]?.votes || 0;
  const winners = sortedResults.filter(r => r.votes === highestVotes);
  const hasWinner = election.status === "ended" && highestVotes > 0;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  return (
    <Layout>
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6">
          <Link 
            to={isAdmin ? "/admin" : "/dashboard"} 
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to {isAdmin ? "Admin " : ""}Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{election.title} Results</h1>
            {getStatusBadge(election.status)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <span className="text-muted-foreground">Start:</span>{" "}
              {formatDate(election.startDate)}
            </div>
            <div>
              <span className="text-muted-foreground">End:</span>{" "}
              {formatDate(election.endDate)}
            </div>
          </div>
        </div>

        {election.status === "active" && (
          <Card className="mb-6 bg-muted/50">
            <CardContent className="py-4">
              <p className="text-center text-sm">
                This election is still in progress. Results may change as more votes are cast.
              </p>
            </CardContent>
          </Card>
        )}

        {hasWinner && (
          <Card className="mb-6 bg-green-50 dark:bg-green-950/20 border-green-500/50">
            <CardContent className="py-4">
              <h3 className="font-medium text-center">
                {winners.length > 1 
                  ? "The election resulted in a tie between:" 
                  : "Winner:"} {" "}
                <span className="font-bold">
                  {winners.map(w => w.candidate.name).join(" and ")}
                </span>
              </h3>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Results</span>
              <span className="text-sm font-normal">
                Total Votes: {totalVotes}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sortedResults.map((result) => (
                <div key={result.candidate.id}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium">{result.candidate.name}</div>
                    <div className="text-sm">
                      {result.votes} vote{result.votes !== 1 ? "s" : ""} (
                      {result.percentage.toFixed(1)}%)
                    </div>
                  </div>
                  <Progress 
                    value={result.percentage} 
                    className="h-3"
                  />
                  {result.candidate.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.candidate.description}
                    </p>
                  )}
                </div>
              ))}

              {totalVotes === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No votes have been cast yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Results;
