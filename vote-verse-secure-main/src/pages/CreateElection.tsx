
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { X, PlusCircle, Save } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";
import { createElection } from "@/utils/electionUtils";

const CreateElection = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [candidates, setCandidates] = useState([
    { id: "candidate1", name: "", description: "" },
    { id: "candidate2", name: "", description: "" },
  ]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddCandidate = () => {
    setCandidates([
      ...candidates,
      { id: `candidate${Date.now()}`, name: "", description: "" },
    ]);
  };

  const handleRemoveCandidate = (id: string) => {
    if (candidates.length <= 2) {
      toast({
        title: "Cannot remove candidate",
        description: "At least two candidates are required for an election",
        variant: "destructive",
      });
      return;
    }
    setCandidates(candidates.filter((c) => c.id !== id));
  };

  const handleCandidateChange = (
    id: string,
    field: "name" | "description",
    value: string
  ) => {
    setCandidates(
      candidates.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!title || !description || !startDate || !endDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (candidates.some((c) => !c.name)) {
      toast({
        title: "Validation Error",
        description: "Please provide a name for all candidates",
        variant: "destructive",
      });
      return;
    }

    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();

    if (endTimestamp <= startTimestamp) {
      toast({
        title: "Validation Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    // Create election
    try {
      const newElection = createElection({
        title,
        description,
        startDate: startTimestamp,
        endDate: endTimestamp,
        candidates,
      });

      toast({
        title: "Election Created",
        description: `"${title}" has been created successfully`,
      });

      navigate("/admin");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create election",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Create New Election</h1>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Election Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Election Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Student Council President Election"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose of this election"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Candidates</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCandidate}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Candidate
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {candidates.map((candidate, index) => (
                <div
                  key={candidate.id}
                  className="p-4 border rounded-md relative"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => handleRemoveCandidate(candidate.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <h3 className="font-medium mb-4">Candidate {index + 1}</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`candidate-${candidate.id}-name`}>
                        Name
                      </Label>
                      <Input
                        id={`candidate-${candidate.id}-name`}
                        value={candidate.name}
                        onChange={(e) =>
                          handleCandidateChange(
                            candidate.id,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Candidate name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`candidate-${candidate.id}-description`}>
                        Description
                      </Label>
                      <Textarea
                        id={`candidate-${candidate.id}-description`}
                        value={candidate.description}
                        onChange={(e) =>
                          handleCandidateChange(
                            candidate.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Brief description of the candidate"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <CardFooter className="flex justify-end gap-4 px-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin")}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Create Election
            </Button>
          </CardFooter>
        </form>
      </div>
    </Layout>
  );
};

export default CreateElection;
