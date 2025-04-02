
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { ShieldCheck, Vote, BarChart3, Lock, CheckCircle, Globe, Users } from "lucide-react";

const Index = () => {
  const { isAuthenticated, isAdmin, isCandidate, isVoter } = useAuth();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl">
        <motion.section
          className="py-16 md:py-24 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Vote className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Secure Online Voting Made Simple
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl text-muted-foreground max-w-3xl mb-8"
            >
              VoteVerse provides a secure, transparent, and accessible platform
              for conducting elections of all sizes. We guarantee privacy,
              accuracy, and reliability.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              {isAuthenticated ? (
                <Link to={isAdmin ? "/admin" : isCandidate ? "/candidate/dashboard" : "/dashboard"}>
                  <Button size="lg" className="px-8">
                    Go to {isAdmin ? "Admin Dashboard" : isCandidate ? "Candidate Dashboard" : "Dashboard"}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="px-8">
                      Register to Vote
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="px-8">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="py-16 mb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            variants={itemVariants}
          >
            Why Choose VoteVerse?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md border border-border/40 hover:shadow-lg transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Lock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Voting</h3>
              <p className="text-muted-foreground">
                End-to-end encryption and verification ensure your vote remains
                secure and counted accurately.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md border border-border/40 hover:shadow-lg transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Access</h3>
              <p className="text-muted-foreground">
                Vote from anywhere, anytime on any device with internet access,
                without compromising security.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md border border-border/40 hover:shadow-lg transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Results</h3>
              <p className="text-muted-foreground">
                View election results with detailed analytics instantly as they
                come in after the election ends.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md border border-border/40 hover:shadow-lg transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verifiable</h3>
              <p className="text-muted-foreground">
                Confirm your vote was recorded correctly with our transparent
                verification process and audit trail.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section 
          className="py-16 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-muted p-8 md:p-12 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-600/10 z-0"></div>
            <div className="relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                <motion.h2 
                  className="text-3xl font-bold mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Ready to modernize your voting process?
                </motion.h2>
                <motion.p 
                  className="text-xl text-muted-foreground mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  Join thousands of organizations that trust VoteVerse for their
                  elections. Our platform has facilitated over 10,000 successful elections worldwide.
                </motion.p>
                {!isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link to="/register">
                      <Button size="lg" className="px-8 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                        Get Started
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="py-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            variants={itemVariants}
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="relative p-6"
              variants={itemVariants}
            >
              <div className="absolute top-0 left-8 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl font-bold text-primary">1</div>
              <div className="pt-16 pb-6 px-6 bg-card rounded-lg border shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-muted-foreground">
                  Register as a voter or candidate with your email and secure password. Verify your identity to ensure election integrity.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="relative p-6"
              variants={itemVariants}
            >
              <div className="absolute top-0 left-8 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl font-bold text-primary">2</div>
              <div className="pt-16 pb-6 px-6 bg-card rounded-lg border shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Participate in Elections</h3>
                <p className="text-muted-foreground">
                  Browse active elections, research candidates, and cast your secure vote during the election period.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="relative p-6"
              variants={itemVariants}
            >
              <div className="absolute top-0 left-8 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl font-bold text-primary">3</div>
              <div className="pt-16 pb-6 px-6 bg-card rounded-lg border shadow-sm">
                <h3 className="text-xl font-semibold mb-2">View Results</h3>
                <p className="text-muted-foreground">
                  After an election ends, access detailed results with vote counts, percentages, and visualizations.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section 
          className="py-16 mb-8 border-t"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">10,000+</h3>
              <p className="text-muted-foreground">Elections Conducted</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">1M+</h3>
              <p className="text-muted-foreground">Votes Cast</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-primary mb-2">99.9%</h3>
              <p className="text-muted-foreground">System Uptime</p>
            </div>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
};

export default Index;
