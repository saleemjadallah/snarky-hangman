
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
            <h1 className="text-4xl font-bold">Privacy Policy for Snarky Hangman</h1>
            <p className="text-sm text-muted-foreground">Last Updated: February 20, 2025</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Introduction</h2>
                <p>Welcome to Snarky Hangman's Privacy Policy. Yes, even a game about guessing words needs one of these. We at MinaZiggy Co LLC take your privacy seriously (even if our AI doesn't take much else seriously).</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">Information We Collect</h2>
                <h3 className="text-xl font-medium mt-4">Information You Give Us</h3>
                <p>We collect the following information when you play Snarky Hangman:</p>
                <ul className="list-disc pl-6">
                  <li>Your name (or whatever clever nickname you choose)</li>
                  <li>Email address (for account management and to send you virtual high-fives)</li>
                  <li>Game statistics (because we love data, and our AI needs something to be smug about)</li>
                  <li>Your victories and defeats (mostly defeats, let's be honest)</li>
                </ul>

                <h3 className="text-xl font-medium mt-4">Information Automatically Collected</h3>
                <p>Our game automatically collects:</p>
                <ul className="list-disc pl-6">
                  <li>Device information (what you're playing on)</li>
                  <li>IP address (where you're getting roasted from)</li>
                  <li>Browser type (how you're viewing our witty remarks)</li>
                  <li>Game interaction data (every glorious mistake)</li>
                  <li>Performance metrics (how badly our AI is beating you)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
                <h3 className="text-xl font-medium mt-4">Primary Uses</h3>
                <p>We use your information to:</p>
                <ul className="list-disc pl-6">
                  <li>Maintain your game account</li>
                  <li>Track your progress (or lack thereof)</li>
                  <li>Generate personalized sarcastic comments</li>
                  <li>Improve our AI's wit and wisdom</li>
                  <li>Keep the leaderboards accurate and humbling</li>
                </ul>

                <h3 className="text-xl font-medium mt-4">Game Improvement</h3>
                <p>Your data helps us:</p>
                <ul className="list-disc pl-6">
                  <li>Develop new ways to challenge you</li>
                  <li>Create more sophisticated mockery</li>
                  <li>Enhance game features</li>
                  <li>Fix bugs (yes, they exist, even in perfection)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">Data Storage and Security</h2>
                <p>We store your data securely in our Supabase database. While our AI may be ruthless with its jokes, we're serious about protecting your information. We use industry-standard encryption and security measures to keep your data safe from everyone except our sarcastic AI.</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">Data Sharing</h2>
                <h3 className="text-xl font-medium mt-4">Who We Share With</h3>
                <p>We share your data with:</p>
                <ul className="list-disc pl-6">
                  <li>Our game servers (they need to know who to taunt)</li>
                  <li>Authorized team members (who are sworn to secrecy)</li>
                  <li>Other players (just your game stats, for competitive humiliation)</li>
                </ul>

                <h3 className="text-xl font-medium mt-4">What We Don't Share</h3>
                <p>We never share:</p>
                <ul className="list-disc pl-6">
                  <li>Your email address</li>
                  <li>Personal information</li>
                  <li>Payment details</li>
                  <li>Your embarrassing guess history</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6">
                  <li>Access your data (see your defeat statistics)</li>
                  <li>Correct your information (though not your wrong guesses)</li>
                  <li>Delete your account (rage-quitting is tracked too)</li>
                  <li>Export your data (if you want proof of your adventures)</li>
                  <li>Lodge complaints (about the AI's attitude, but it won't help)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">Cookie Policy</h2>
                <p>We use cookies to:</p>
                <ul className="list-disc pl-6">
                  <li>Remember your preferences</li>
                  <li>Keep you logged in</li>
                  <li>Track game progress</li>
                  <li>Store local game data</li>
                  <li>Count how many times you've rage-quit</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">Children's Privacy</h2>
                <p>Snarky Hangman is suitable for players aged 13 and up. We do not knowingly collect data from players under 13. If our AI seems too harsh, maybe wait a few years.</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">Changes to Privacy Policy</h2>
                <p>We may update this policy occasionally. We'll notify you of significant changes through:</p>
                <ul className="list-disc pl-6">
                  <li>In-game notifications</li>
                  <li>Email updates</li>
                  <li>A specially crafted sarcastic message</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">Contact Information</h2>
                <p>For privacy-related questions, contact us at:</p>
                <ul className="list-disc pl-6">
                  <li>Email: game@snarkyhangman.com</li>
                  <li>Address: MinaZiggy Co LLC Headquarters</li>
                  <li>Support: Available through our website</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">Legal Compliance</h2>
                <p>This policy complies with:</p>
                <ul className="list-disc pl-6">
                  <li>GDPR requirements</li>
                  <li>CCPA regulations</li>
                  <li>Local data protection laws</li>
                  <li>Common sense (mostly)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">Data Retention</h2>
                <p>We retain your data for:</p>
                <ul className="list-disc pl-6">
                  <li>Account information: Until account deletion</li>
                  <li>Game statistics: Indefinitely (your defeats are eternal)</li>
                  <li>Chat logs: 30 days</li>
                  <li>Performance data: 90 days</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">Notification of Breaches</h2>
                <p>In the unlikely event of a data breach, we will:</p>
                <ul className="list-disc pl-6">
                  <li>Notify affected users promptly</li>
                  <li>Provide details of compromised data</li>
                  <li>Outline steps taken to resolve the issue</li>
                  <li>Have our AI prepare a particularly apologetic set of jokes</li>
                </ul>
              </div>

              <p className="mt-8 text-sm italic">Remember, while our AI may mock your word-guessing abilities, we take your privacy very seriously. This policy ensures you understand how we handle your information while you enjoy being outwitted by our artificially intelligent companion.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
