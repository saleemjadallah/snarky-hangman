
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsConditions() {
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
            <h1 className="text-4xl font-bold">Terms & Conditions</h1>
            <p className="text-sm text-muted-foreground">Last updated: March 14, 2024</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement.</p>

            <h2>2. User Accounts</h2>
            <p>When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account.</p>

            <h2>3. Intellectual Property</h2>
            <p>The Service and its original content, features, and functionality are owned by MinaZiggy Co LLC and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>

            <h2>4. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any portion of the service</li>
              <li>Interfere with or disrupt the service</li>
              <li>Sell or transfer your account</li>
            </ul>

            <h2>5. Termination</h2>
            <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
