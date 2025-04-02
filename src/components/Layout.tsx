
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, ShieldCheck, FileText, BarChart3, Settings } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

const Layout = ({ children, showNav = true }: LayoutProps) => {
  const { user, logout, isAdmin, isCandidate, isVoter } = useAuth();
  const location = useLocation();

  const NavLink = ({ to, label }: { to: string; label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`hover:text-white/90 transition-colors ${
          isActive ? "font-medium text-white" : "text-white/80"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showNav && (
        <header className="bg-primary text-primary-foreground shadow-md">
          <div className="container mx-auto py-4 px-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
              VoteVerse
            </Link>
            <nav className="flex items-center gap-6">
              {user ? (
                <>
                  {isAdmin && (
                    <>
                      <NavLink to="/admin" label="Dashboard" />
                      <NavLink to="/admin/create-election" label="Create Election" />
                    </>
                  )}
                  
                  {isCandidate && (
                    <>
                      <NavLink to="/candidate/dashboard" label="Dashboard" />
                    </>
                  )}
                  
                  {isVoter && (
                    <>
                      <NavLink to="/dashboard" label="Elections" />
                      <NavLink to="/profile" label="My Profile" />
                    </>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-sm">
                      {isAdmin ? (
                        <ShieldCheck className="h-4 w-4" />
                      ) : isCandidate ? (
                        <FileText className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span>
                        {user.name} {isAdmin ? (user.adminId) : isCandidate ? (user.candidateId) : (user.voterId)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={logout}
                      className="hover:bg-primary-foreground/10"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-white/90">
                    Login
                  </Link>
                  <Link to="/register">
                    <Button variant="secondary" size="sm">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
      )}
      <main className="flex-1 py-8 px-4">{children}</main>
      <footer className="bg-muted py-6">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2023 VoteVerse. Secure Online Voting Platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
