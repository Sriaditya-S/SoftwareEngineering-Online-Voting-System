
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'voter' | 'candidate' | 'admin';
  voterId?: string;
  candidateId?: string;
  adminId?: string;
  bio?: string;
  party?: string;
  position?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'voter' | 'candidate') => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCandidate: boolean;
  isVoter: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem("voteVerseUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, you would validate credentials against a backend
      // For this demo, we'll simulate authentication with mock users
      const mockUsers = [
        { 
          id: "1", 
          name: "Admin User", 
          email: "admin@example.com", 
          password: "admin123", 
          role: "admin" as const,
          adminId: "ADMIN001" 
        },
        { 
          id: "2", 
          name: "Voter User", 
          email: "voter@example.com", 
          password: "voter123", 
          role: "voter" as const,
          voterId: "VOTER001" 
        },
        { 
          id: "3", 
          name: "Harini Venkatesan", 
          email: "candidate@example.com", 
          password: "candidate123", 
          role: "candidate" as const,
          candidateId: "CAND001",
          bio: "Experienced leader with a passion for community service",
          party: "Progress Party",
          position: "City Council"
        },
      ];

      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("voteVerseUser", JSON.stringify(userWithoutPassword));
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: 'voter' | 'candidate' = 'voter') => {
    try {
      // In a real app, you would send registration data to a backend
      // For this demo, we'll simulate registration
      let newUser: User;
      
      if (role === 'candidate') {
        newUser = {
          id: `candidate_${Date.now()}`,
          name,
          email,
          role: 'candidate',
          candidateId: `CAND${Math.floor(1000 + Math.random() * 9000)}`,
          bio: "",
          party: "",
          position: ""
        };
      } else {
        newUser = {
          id: `voter_${Date.now()}`,
          name,
          email,
          role: 'voter',
          voterId: `VOTER${Math.floor(1000 + Math.random() * 9000)}`,
        };
      }

      setUser(newUser);
      localStorage.setItem("voteVerseUser", JSON.stringify(newUser));
      toast({
        title: "Registration successful",
        description: role === 'candidate' 
          ? `Welcome, ${name}! Your candidate ID is ${newUser.candidateId}`
          : `Welcome, ${name}! Your voter ID is ${newUser.voterId}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      if (!user) throw new Error("No user logged in");
      
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem("voteVerseUser", JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      return Promise.resolve();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("voteVerseUser");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isCandidate: user?.role === 'candidate',
        isVoter: user?.role === 'voter',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
