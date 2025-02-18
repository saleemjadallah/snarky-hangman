
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Game
          </Button>
        </Link>

        <div className="space-y-8 text-foreground">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: March 14, 2024</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including when you:</p>
            <ul>
              <li>Create an account</li>
              <li>Play games</li>
              <li>Communicate with us</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and improve our services</li>
              <li>Communicate with you</li>
              <li>Analyze usage patterns</li>
              <li>Protect against fraud and abuse</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul>
              <li>Service providers</li>
              <li>Legal authorities when required</li>
              <li>Business partners with your consent</li>
            </ul>

            <h2>4. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
