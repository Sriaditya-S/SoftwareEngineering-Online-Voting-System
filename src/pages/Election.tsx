
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, ChevronLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { 
  getElectionById, 
  castVote, 
  hasUserVoted 
} from "@/utils/electionUtils";

const Election = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [election, setElection] = useState(id ? getElectionById(id) : undefined);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate("/dashboard");
      return;
    }

    const electionData = getElectionById(id);
    if (!electionData) {
      toast({
        title: "Election Not Found",
        description: "The election you are looking for does not exist",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    setElection(electionData);
    
    // Check if user has already voted
    if (user) {
      const userHasVoted = hasUserVoted(user.id, id);
      setHasVoted(userHasVoted);
      
      if (userHasVoted) {
        toast({
          title: "Already Voted",
          description: "You have already cast your vote in this election",
        });
      }
    }
  }, [id, user, navigate, toast]);

  const handleVote = () => {
    if (!user || !election || !selectedCandidate) return;
    
    setIsSubmitting(true);
    
    try {
      castVote({
        electionId: election.id,
        userId: user.id,
        candidateId: selectedCandidate,
      });
      
      toast({
        title: "Vote Cast Successfully",
        description: "Your vote has been recorded securely",
      });
      
      setHasVoted(true);
      navigate(`/results/${election.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cast vote",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!election) {
    return <div>Loading...</div>;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const isDisabled = election.status !== "active" || hasVoted;

  return (
    <Layout>
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6">
          <Link to="/dashboard" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{election.title}</h1>
            {getStatusBadge(election.status)}
          </div>
          <p className="text-muted-foreground mt-2">{election.description}</p>
          
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

        {isDisabled && (
          <Card className="mb-6 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="flex items-start gap-4 py-4">
              <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">
                  {hasVoted
                    ? "You have already voted in this election"
                    : election.status === "upcoming"
                    ? "This election has not started yet"
                    : "This election has ended"}
                </h3>
                {hasVoted && (
                  <p className="text-sm text-muted-foreground mt-1">
                    You can view the results by clicking the button below.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ballot</CardTitle>
            <CardDescription>
              Select a candidate and submit your vote
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {election.candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={`ballot-option ${
                    selectedCandidate === candidate.id ? "selected" : ""
                  }`}
                  onClick={() => !isDisabled && setSelectedCandidate(candidate.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedCandidate === candidate.id
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300"
                      } ${isDisabled ? "opacity-50" : ""}`}
                    >
                      {selectedCandidate === candidate.id && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{candidate.name}</h3>
                      {candidate.description && (
                        <p className="text-muted-foreground text-sm mt-1">
                          {candidate.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            {hasVoted ? (
              <Link to={`/results/${election.id}`}>
                <Button>View Results</Button>
              </Link>
            ) : (
              <Button
                onClick={handleVote}
                disabled={!selectedCandidate || isDisabled || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Vote"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Election;
