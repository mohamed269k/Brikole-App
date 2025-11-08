
import React from 'react';

interface StaticPageProps {
  t: (key: string) => string;
}

const PrivacyPolicyPage: React.FC<StaticPageProps> = ({ t }) => {
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
          <h1>Privacy Policy</h1>
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

          <h2>1. Introduction</h2>
          <p>Welcome to Brikole Home Services ("Brikole", "we", "us", or "our"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. By using Brikole, you agree to the collection and use of information in accordance with this policy.</p>

          <h2>2. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect on the platform includes:</p>
          <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, phone number, and location, that you voluntarily give to us when you register with the platform.</li>
            <li><strong>Usage Data:</strong> Information our servers automatically collect when you access the platform, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the platform.</li>
            <li><strong>Geolocation Information:</strong> We may request access or permission to and track location-based information from your mobile device, either continuously or while you are using our application, to provide location-based services.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the platform to:</p>
          <ul>
            <li>Create and manage your account.</li>
            <li>Connect you with service providers for your requested services.</li>
            <li>Email you regarding your account or order.</li>
            <li>Improve our platform and offerings.</li>
            <li>Monitor and analyze usage and trends to improve your experience.</li>
            <li>Notify you of updates to the platform.</li>
            <li>Resolve disputes and troubleshoot problems.</li>
          </ul>

          <h2>4. Disclosure of Your Information</h2>
          <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
          <ul>
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law.</li>
            <li><strong>With Service Providers:</strong> We will share your information (such as your name, contact details, and service location) with service providers to enable them to perform the requested service.</li>
          </ul>
          
          <h2>5. Security of Your Information</h2>
          <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

          <h2>6. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

          <h2>7. Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, please contact us at: support@brikole.ma</p>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
