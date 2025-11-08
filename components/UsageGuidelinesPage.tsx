import React from 'react';

interface StaticPageProps {
  t: (key: string) => string;
}

const UsageGuidelinesPage: React.FC<StaticPageProps> = ({ t }) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-16 text-gray-300">
      <div className="max-w-3xl mx-auto bg-gray-800/50 border border-gray-700 rounded-xl p-8 animate-fade-in">
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
          .prose-styles h1 { font-size: 2.25rem; font-weight: bold; color: #FBBF24; margin-bottom: 1.5rem; }
          .prose-styles h2 { font-size: 1.5rem; font-weight: bold; color: white; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid #4A5568; padding-bottom: 0.5rem; }
          .prose-styles p { margin-bottom: 1rem; line-height: 1.7; }
          .prose-styles ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
          .prose-styles li { margin-bottom: 0.5rem; }
        `}</style>
        <div className="prose-styles">
          <h1>Usage Guidelines</h1>
          <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
          
          <h2>1. Introduction</h2>
          <p>Welcome to Brikole! Our mission is to create a safe, reliable, and respectful community for clients and service providers. These guidelines are designed to ensure a positive experience for everyone. By using our platform, you agree to abide by these rules.</p>
          
          <h2>2. For Clients</h2>
          <ul>
            <li><strong>Be Clear and Accurate:</strong> Provide clear and detailed descriptions of the service you need. The more information you provide, the better a professional can assist you.</li>
            <li><strong>Communicate Respectfully:</strong> Treat service providers with courtesy and respect. Clear, polite communication is key to a successful service experience.</li>
            <li><strong>Safety First:</strong> Ensure a safe working environment for the service provider. Secure any pets and clear the work area of obstacles.</li>
            <li><strong>Honest Reviews:</strong> Provide fair and honest feedback based on your experience. Reviews help our community and maintain high standards.</li>
          </ul>

          <h2>3. For Service Providers</h2>
          <ul>
            <li><strong>Professionalism is Key:</strong> Present yourself professionally at all times. This includes your appearance, communication, and conduct on the job.</li>
            <li><strong>Quality Workmanship:</strong> Complete all jobs to the best of your ability and to a high standard. Do not cut corners or use substandard materials.</li>
            <li><strong>Transparent Pricing:</strong> Be clear and upfront about your pricing before starting any work. Avoid hidden fees or surprise charges.</li>
            <li><strong>Punctuality and Reliability:</strong> Arrive on time for appointments. If you are delayed, communicate this to the client as soon as possible.</li>
            <li><strong>Respect Client Property:</strong> Treat the client's home and belongings with care and respect. Leave the work area clean and tidy upon completion.</li>
          </ul>
          
          <h2>4. Prohibited Activities</h2>
          <p>The following activities are strictly prohibited on the Brikole platform:</p>
          <ul>
            <li>Any form of harassment, discrimination, or hate speech.</li>
            <li>Illegal activities or requests for illegal services.</li>
            <li>Fraud, spam, or misleading information.</li>
            <li>Taking transactions off-platform to avoid fees or platform oversight.</li>
            <li>Posting false or defamatory reviews.</li>
          </ul>

          <h2>5. Enforcement</h2>
          <p>Violations of these guidelines may result in a warning, temporary suspension, or permanent removal from the platform.</p>
        </div>
      </div>
    </main>
  );
};

export default UsageGuidelinesPage;