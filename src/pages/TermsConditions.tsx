
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
            <h1 className="text-4xl font-bold">Terms & Conditions for Snarky Hangman</h1>
            <p className="text-sm text-muted-foreground">Last updated: February 20, 2025</p>
          </div>

          <div className="prose prose-gray max-w-none">
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">1. Introduction</h2>
                <p>Welcome to Snarky Hangman! These Terms and Conditions ("Terms") govern your use of Snarky Hangman (the "Game"), operated by MinaZiggy Co LLC ("we," "us," or "our"). By accessing or using our Game, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the Game.</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">2. Definitions</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>"Content" refers to all text, images, data, information, and other materials generated, provided, or otherwise made available through the Game.</li>
                  <li>"User," "you," and "your" refer to any individual who accesses or uses the Game.</li>
                  <li>"AI" refers to our artificially intelligent game component that generates words and interactive responses.</li>
                  <li>"Service" refers to the Snarky Hangman game and all its features.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">3. Account Registration and Security</h2>
                
                <h3 className="text-xl font-medium mt-4">3.1 Account Creation</h3>
                <p>To play Snarky Hangman, you need to provide:</p>
                <ul className="list-disc pl-6">
                  <li>A name or nickname</li>
                  <li>A valid email address</li>
                </ul>

                <h3 className="text-xl font-medium mt-4">3.2 Account Security</h3>
                <p>You are responsible for:</p>
                <ul className="list-disc pl-6">
                  <li>Maintaining the confidentiality of your account</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us of any unauthorized access</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">4. Game Rules and Fair Play</h2>

                <h3 className="text-xl font-medium mt-4">4.1 Gameplay</h3>
                <ul className="list-disc pl-6">
                  <li>Words are generated through our AI system</li>
                  <li>Each difficulty level has specific time limits and hint allowances</li>
                  <li>Scores are calculated based on time, hints used, and difficulty level</li>
                </ul>

                <h3 className="text-xl font-medium mt-4">4.2 Fair Play</h3>
                <p>You agree not to:</p>
                <ul className="list-disc pl-6">
                  <li>Use external tools or aids to solve words</li>
                  <li>Exploit game bugs or glitches</li>
                  <li>Share answers with other players during active challenges</li>
                  <li>Manipulate the scoring system</li>
                  <li>Use automated systems to play the game</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">5. User Content and Conduct</h2>

                <h3 className="text-xl font-medium mt-4">5.1 User Conduct</h3>
                <p>You agree not to:</p>
                <ul className="list-disc pl-6">
                  <li>Use offensive or inappropriate nicknames</li>
                  <li>Harass other players</li>
                  <li>Share inappropriate content through the challenge system</li>
                  <li>Attempt to deceive or manipulate other users</li>
                </ul>

                <h3 className="text-xl font-medium mt-4">5.2 Content Ownership</h3>
                <ul className="list-disc pl-6">
                  <li>We retain all rights to game content, including AI-generated responses</li>
                  <li>Your game statistics and achievements may be used for leaderboards and challenges</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>

                <h3 className="text-xl font-medium mt-4">6.1 Ownership</h3>
                <ul className="list-disc pl-6">
                  <li>The Game, including all content and code, is owned by MinaZiggy Co LLC</li>
                  <li>The AI system and its responses are our intellectual property</li>
                  <li>User statistics and gameplay data may be used to improve the Game</li>
                </ul>

                <h3 className="text-xl font-medium mt-4">6.2 Restrictions</h3>
                <p>You may not:</p>
                <ul className="list-disc pl-6">
                  <li>Copy or modify the Game's code</li>
                  <li>Reverse engineer the Game</li>
                  <li>Create derivative works</li>
                  <li>Remove any copyright or proprietary notices</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">7. Privacy and Data Usage</h2>

                <h3 className="text-xl font-medium mt-4">7.1 Data Collection</h3>
                <p>We collect:</p>
                <ul className="list-disc pl-6">
                  <li>Account information</li>
                  <li>Game statistics</li>
                  <li>Device information</li>
                  <li>Usage data</li>
                </ul>

                <h3 className="text-xl font-medium mt-4">7.2 Data Usage</h3>
                <p>We use collected data to:</p>
                <ul className="list-disc pl-6">
                  <li>Operate and improve the Game</li>
                  <li>Generate leaderboards</li>
                  <li>Create personalized experiences</li>
                  <li>Maintain game security</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">8. Termination</h2>

                <h3 className="text-xl font-medium mt-4">8.1 Account Termination</h3>
                <p>We reserve the right to:</p>
                <ul className="list-disc pl-6">
                  <li>Suspend or terminate accounts for violations</li>
                  <li>Remove inappropriate content</li>
                  <li>Modify or delete game data</li>
                  <li>Restrict access to features</li>
                </ul>

                <h3 className="text-xl font-medium mt-4">8.2 Effect of Termination</h3>
                <p>Upon termination:</p>
                <ul className="list-disc pl-6">
                  <li>Access to the Game will be revoked</li>
                  <li>Scores and achievements may be removed</li>
                  <li>Challenge links will become invalid</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">9. Disclaimers and Limitations</h2>

                <h3 className="text-xl font-medium mt-4">9.1 Service Availability</h3>
                <ul className="list-disc pl-6">
                  <li>The Game is provided "as is"</li>
                  <li>We do not guarantee uninterrupted service</li>
                  <li>Game features may change without notice</li>
                  <li>AI responses are generated automatically and may vary</li>
                </ul>

                <h3 className="text-xl font-medium mt-4">9.2 Limitation of Liability</h3>
                <p>We are not liable for:</p>
                <ul className="list-disc pl-6">
                  <li>Lost game progress</li>
                  <li>Server downtime</li>
                  <li>Data loss</li>
                  <li>Emotional damage from our AI's savage comebacks</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">10. Changes to Terms</h2>
                <p>We may modify these Terms at any time. Continued use of the Game constitutes acceptance of modified Terms.</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">11. Contact Information</h2>
                <p>For questions about these Terms:</p>
                <ul className="list-none">
                  <li>Email: legal@snarkyhangman.com</li>
                  <li>Address: MinaZiggy Co LLC Headquarters</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">12. Governing Law</h2>
                <p>These Terms are governed by [Jurisdiction] law, without regard to its conflict of law principles.</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">13. Severability</h2>
                <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in effect.</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold">14. Special Provisions</h2>

                <h3 className="text-xl font-medium mt-4">14.1 AI Interactions</h3>
                <ul className="list-disc pl-6">
                  <li>AI responses are generated automatically</li>
                  <li>We do not guarantee specific AI behavior</li>
                  <li>AI personality is part of the game experience</li>
                </ul>

                <h3 className="text-xl font-medium mt-4">14.2 Challenges and Social Features</h3>
                <ul className="list-disc pl-6">
                  <li>Challenge links expire after 24 hours</li>
                  <li>Shared scores are visible to other players</li>
                  <li>Friend connections are public within the game</li>
                </ul>
              </div>

              <p className="mt-8 text-sm italic">By using Snarky Hangman, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
