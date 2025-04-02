
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, User, Flag, Briefcase } from "lucide-react";
import Layout from "@/components/Layout";

// Mock candidate data
const mockCandidates = [
  {
    id: "CAND001",
    name: "Harini Venkatesan",
    party: "Progress Party",
    position: "City Council",
    bio: "Experienced leader with a passion for community service. Harini has served on various community boards and has a strong background in urban planning. She is committed to sustainable development and inclusive governance.",
    image: "/placeholder.svg",
    qualifications: [
      "Master's in Public Administration",
      "10 years on City Planning Commission",
      "Award-winning community organizer"
    ],
    platform: [
      "Sustainable urban development",
      "Transparent government operations",
      "Inclusive community engagement",
      "Economic growth opportunities for small businesses"
    ]
  },
  {
    id: "CAND002",
    name: "Pradeep Manivannan",
    party: "Unity Alliance",
    position: "School Board",
    bio: "Former educator and parent advocate. Pradeep has dedicated his career to improving educational outcomes for all students. He believes in equality of opportunity and resources for schools across all districts.",
    image: "/placeholder.svg",
    qualifications: [
      "Ph.D. in Education Policy",
      "15 years as high school principal",
      "Education reform consultant"
    ],
    platform: [
      "Equitable resource distribution among schools",
      "Teacher retention and development programs",
      "Curriculum modernization initiatives",
      "Parent involvement strategies"
    ]
  }
];

const CandidateDetails = () => {
  const { id } = useParams<{ id: string }>();
  const candidate = mockCandidates.find(c => c.id === id);

  if (!candidate) {
    return (
      <Layout>
        <div className="container mx-auto max-w-3xl text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Candidate Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The candidate you are looking for does not exist or has been removed.
          </p>
          <Link to="/dashboard" className="text-primary hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-3xl">
        <Link to="/dashboard" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-1/3">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img 
                src={candidate.image} 
                alt={candidate.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{candidate.name}</h1>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Flag className="h-4 w-4" />
                <span>{candidate.party}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{candidate.position}</span>
              </div>
            </div>
            <p className="text-muted-foreground">{candidate.bio}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Qualifications</CardTitle>
              <CardDescription>
                Education and experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {candidate.qualifications.map((qualification, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="min-w-4 mt-1">•</div>
                    <p>{qualification}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Platform</CardTitle>
              <CardDescription>
                Key policy positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {candidate.platform.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="min-w-4 mt-1">•</div>
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CandidateDetails;
