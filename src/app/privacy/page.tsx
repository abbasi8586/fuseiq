import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — FuseIQ",
  description: "Privacy Policy for FuseIQ AI Agent Command Center",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#06070A] text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-[#6B7290] mb-6">Last updated: May 1, 2026</p>

        <div className="space-y-6 text-[#B8BED8]">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, including your name, email address, and payment information. We also collect data about your use of the Platform, including agent configurations, execution logs, and usage metrics.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve the Platform, process transactions, send technical notices and support messages, and monitor usage patterns to optimize performance.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Data Security</h2>
            <p>We implement industry-standard security measures including AES-256-GCM encryption, secure data transmission via TLS, and regular security audits. Your API keys and sensitive configuration data are encrypted at rest.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Retention</h2>
            <p>We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Third-Party Services</h2>
            <p>The Platform integrates with third-party LLM providers (OpenAI, Anthropic, Google, etc.) and services (Stripe for payments, Supabase for data storage). Your use of these integrations is subject to their respective privacy policies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data. Contact us to exercise these rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Contact</h2>
            <p>For privacy-related questions, contact us at privacy@fuseiq.io.</p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06]">
          <Link href="/" className="text-[#00D4FF] hover:underline">← Back to FuseIQ</Link>
        </div>
      </div>
    </div>
  );
}
