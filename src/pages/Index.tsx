import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react"
import { Link } from "react-router-dom"

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground">
              Master Trading with
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Challenges</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Prove your trading skills and earn real funding. Start your journey with our 
              professional trading challenges designed for serious traders.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link to="/checkout">
              <Button variant="checkout" size="xl" className="group">
                Start Challenge
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="xl">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Profit Sharing</h3>
            <p className="text-muted-foreground">
              Keep up to 80% of your trading profits once you pass our evaluation
            </p>
          </div>

          <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Risk Management</h3>
            <p className="text-muted-foreground">
              Learn professional risk management with our structured challenge rules
            </p>
          </div>

          <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Fast Evaluation</h3>
            <p className="text-muted-foreground">
              Quick evaluation process with instant feedback on your trading performance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
