
import { Card, CardHeader, CardContent, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getElections, getElectionResults } from "@/utils/electionUtils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Vote } from "lucide-react";
import { useState } from "react";

const ResultsTab = () => {
  const { user } = useAuth();
  const elections = getElections();
  const [selectedElection, setSelectedElection] = useState<string | null>(null);
  
  // Filter elections where this candidate is participating
  const myElections = elections.filter(election => 
    election.candidates.some(candidate => candidate.id === user?.candidateId)
  );

  const completedElections = myElections.filter(e => e.status === 'ended');

  // Get results for selected election
  const getResults = (electionId: string) => {
    try {
      const results = getElectionResults(electionId);
      // Find this candidate's result
      const candidateResult = results.results.find(
        r => r.candidate.id === user?.candidateId
      );
      return {
        ...results,
        candidateResult
      };
    } catch (error) {
      console.error("Error fetching results:", error);
      return null;
    }
  };

  const selectedElectionResults = selectedElection 
    ? getResults(selectedElection) 
    : null;

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Election Results</CardTitle>
        <CardDescription>
          View results for elections you participated in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {completedElections.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedElections.map(election => (
                <Card 
                  key={election.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedElection === election.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedElection(election.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{election.title}</CardTitle>
                    <CardDescription className="text-xs">
                      Ended: {new Date(election.endDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {election.candidates.length} Candidates
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedElectionResults && (
              <div className="p-4 bg-muted rounded-lg animate-fade-in">
                <h3 className="text-xl font-bold mb-4">
                  {elections.find(e => e.id === selectedElection)?.title} Results
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-2">Vote Distribution</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={selectedElectionResults.results}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="votes"
                            nameKey="candidate.name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {selectedElectionResults.results.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name) => [`${value} votes`, name]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Your Performance</h4>
                      <div className="bg-card p-4 rounded-lg border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-muted-foreground">Your Votes:</span>
                          <span className="text-xl font-bold">
                            {selectedElectionResults.candidateResult?.votes || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-muted-foreground">Percentage:</span>
                          <span className="text-xl font-bold">
                            {selectedElectionResults.candidateResult
                              ? `${selectedElectionResults.candidateResult.percentage.toFixed(1)}%`
                              : '0%'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Position:</span>
                          <span className="text-xl font-bold">
                            {selectedElectionResults.results
                              .sort((a, b) => b.votes - a.votes)
                              .findIndex(r => r.candidate.id === user?.candidateId) + 1}
                            {' of '}
                            {selectedElectionResults.results.length}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Election Summary</h4>
                      <div className="bg-card p-4 rounded-lg border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-muted-foreground">Total Votes:</span>
                          <span className="font-bold">{selectedElectionResults.totalVotes}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-muted-foreground">Winner:</span>
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-yellow-500" />
                            <span className="font-bold">
                              {selectedElectionResults.results
                                .sort((a, b) => b.votes - a.votes)[0]?.candidate.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Vote className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No completed elections found.</p>
            <p className="mt-2">Results will appear here once elections you participate in have ended.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsTab;
