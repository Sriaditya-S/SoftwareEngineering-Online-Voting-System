
export interface Candidate {
  id: string;
  name: string;
  description: string;
}

export interface Vote {
  electionId: string;
  userId: string;
  candidateId: string;
  timestamp: number;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: number;
  endDate: number;
  candidates: Candidate[];
  status: 'upcoming' | 'active' | 'ended';
}

// Mock data for demo purposes
let mockElections: Election[] = [
  {
    id: "election1",
    title: "Student Council President Election",
    description: "Vote for the next student council president for the academic year 2023-2024.",
    startDate: Date.now() - 86400000, // 1 day ago
    endDate: Date.now() + 86400000 * 5, // 5 days from now
    candidates: [
      {
        id: "candidate1",
        name: "Harini Venkatesan",
        description: "Junior, Computer Science major with experience in leadership roles.",
      },
      {
        id: "candidate2",
        name: "Kiran Thirumurugan",
        description: "Senior, Political Science major with a focus on student advocacy.",
      },
      {
        id: "candidate3",
        name: "Sathish Balakrishnan",
        description: "Sophomore, Business major with fresh ideas for campus improvement.",
      },
    ],
    status: 'active',
  },
  {
    id: "election2",
    title: "Campus Improvement Fund Allocation",
    description: "Vote on how to allocate the campus improvement fund for this fiscal year.",
    startDate: Date.now() + 86400000 * 2, // 2 days from now
    endDate: Date.now() + 86400000 * 10, // 10 days from now
    candidates: [
      {
        id: "option1",
        name: "Library Renovation",
        description: "Modernize the library with new technology and study spaces.",
      },
      {
        id: "option2",
        name: "Sports Facility Upgrade",
        description: "Upgrade the gymnasium and outdoor sports fields.",
      },
      {
        id: "option3",
        name: "Sustainability Initiatives",
        description: "Invest in renewable energy and eco-friendly campus improvements.",
      },
    ],
    status: 'upcoming',
  },
  {
    id: "election3",
    title: "Faculty Excellence Award",
    description: "Vote for the professor who has demonstrated exceptional teaching and mentorship.",
    startDate: Date.now() - 86400000 * 10, // 10 days ago
    endDate: Date.now() - 86400000, // 1 day ago
    candidates: [
      {
        id: "faculty1",
        name: "Dr. Lakshmi Thirunavukkarasu",
        description: "Professor of Biology, renowned for interactive teaching methods.",
      },
      {
        id: "faculty2",
        name: "Prof. Vasanth Ilangovan",
        description: "Computer Science Department, dedicated mentor to student researchers.",
      },
      {
        id: "faculty3",
        name: "Dr. Aishwarya Periyasamy",
        description: "English Literature, published author and inspiring educator.",
      },
    ],
    status: 'ended',
  },
];

// Mock votes
let mockVotes: Vote[] = [
  { electionId: "election1", userId: "2", candidateId: "candidate2", timestamp: Date.now() - 3600000 },
  { electionId: "election3", userId: "2", candidateId: "faculty1", timestamp: Date.now() - 86400000 * 5 },
];

// Get all elections
export const getElections = (): Election[] => {
  return mockElections.map(election => ({
    ...election,
    status: getElectionStatus(election)
  }));
};

// Get election by ID
export const getElectionById = (id: string): Election | undefined => {
  const election = mockElections.find(e => e.id === id);
  if (election) {
    return {
      ...election,
      status: getElectionStatus(election)
    };
  }
  return undefined;
};

// Create a new election
export const createElection = (election: Omit<Election, 'id' | 'status'>): Election => {
  const newElection: Election = {
    ...election,
    id: `election${Date.now()}`,
    status: getElectionStatus(election as Election)
  };
  
  mockElections.push(newElection);
  return newElection;
};

// Cast a vote
export const castVote = (vote: Omit<Vote, 'timestamp'>): Vote => {
  // Check if user has already voted in this election
  const existingVote = mockVotes.find(v => v.electionId === vote.electionId && v.userId === vote.userId);
  
  if (existingVote) {
    throw new Error("You have already voted in this election");
  }
  
  const newVote: Vote = {
    ...vote,
    timestamp: Date.now()
  };
  
  mockVotes.push(newVote);
  return newVote;
};

// Get votes for an election
export const getVotesForElection = (electionId: string): Vote[] => {
  return mockVotes.filter(vote => vote.electionId === electionId);
};

// Check if a user has voted in a specific election
export const hasUserVoted = (userId: string, electionId: string): boolean => {
  return mockVotes.some(vote => vote.userId === userId && vote.electionId === electionId);
};

// Get election results
export const getElectionResults = (electionId: string) => {
  const votes = getVotesForElection(electionId);
  const election = getElectionById(electionId);
  
  if (!election) {
    throw new Error("Election not found");
  }
  
  const results = election.candidates.map(candidate => {
    const candidateVotes = votes.filter(vote => vote.candidateId === candidate.id).length;
    return {
      candidate,
      votes: candidateVotes,
      percentage: votes.length > 0 ? (candidateVotes / votes.length) * 100 : 0
    };
  });
  
  return {
    election,
    totalVotes: votes.length,
    results
  };
};

// Helper function to determine election status
const getElectionStatus = (election: Election): 'upcoming' | 'active' | 'ended' => {
  const now = Date.now();
  if (now < election.startDate) {
    return 'upcoming';
  } else if (now > election.endDate) {
    return 'ended';
  } else {
    return 'active';
  }
};
