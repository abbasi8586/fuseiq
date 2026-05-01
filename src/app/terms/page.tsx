import Link from "next/link";

export const metadata = {
  title: "Terms of Service — FuseIQ",
  description: "Terms of Service for FuseIQ AI Agent Command Center",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#06070A] text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <p className="text-[#6B7290] mb-6">Last updated: May 1, 2026</p>

        <div className="space-y-6 text-[#B8BED8]">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using FuseIQ ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>FuseIQ provides an AI agent orchestration platform that enables teams to deploy, monitor, and manage AI agents. The Platform includes dashboard analytics, cost tracking, approval workflows, and multi-agent swarm coordination.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Account Registration</h2>
            <p>To use certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Payment and Billing</h2>
            <p>Certain features of the Platform require payment. You agree to pay all fees associated with your selected plan. All fees are non-refundable except as required by law or as explicitly stated in these Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Acceptable Use</h2>
            <p>You agree not to use the Platform for any unlawful purpose or in any way that could damage, disable, overburden, or impair the Platform. You may not attempt to gain unauthorized access to any part of the Platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, FuseIQ and Abbasi Global LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the State of Florida, United States, without regard to its conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Contact</h2>
            <p>For questions about these Terms, please contact us at support@fuseiq.io.</p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06]">
          <Link href="/" className="text-[#00D4FF] hover:underline">← Back to FuseIQ</Link>
        </div>
      </div>
    </div>
  );
}
