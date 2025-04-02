
import { FileEdit } from "lucide-react";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getElections } from "@/utils/electionUtils";

const ElectionsTab = () => {
  const { user } = useAuth();
  const elections = getElections();
  
  // Filter elections where this candidate is participating
  const myElections = elections.filter(election => 
    election.candidates.some(candidate => candidate.id === user?.candidateId)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Elections</CardTitle>
        <CardDescription>
          Elections you are participating in as a candidate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {myElections.length > 0 ? (
          <div className="space-y-4">
            {myElections.map(election => (
              <Card key={election.id} className="overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  <div className="flex-1 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold">{election.title}</h3>
                      <Badge className="bg-green-500">{election.status}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-2">{election.description}</p>
                    <div className="text-sm">
                      <p>Start: {new Date(election.startDate).toLocaleDateString()}</p>
                      <p>End: {new Date(election.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="p-4 flex justify-end items-center bg-muted/50 lg:w-48">
                    <Button variant="outline" size="sm">
                      <FileEdit className="mr-2 h-4 w-4" />
                      Edit Platform
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">You are not currently participating in any elections.</p>
            <p className="mt-2">The election administrator will add you to relevant elections.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ElectionsTab;
