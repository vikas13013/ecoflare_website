// src/pages/PrivacyPolicy.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaUserLock, FaDatabase, FaExchangeAlt, FaUserCog } from "react-icons/fa";
import { HiOutlineDocumentSearch } from "react-icons/hi";

export default function PrivacyPolicy() {
  const smoothScrollToId = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-green-50 py-12 px-4 sm:px-6 flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full max-w-6xl flex flex-col items-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center"
        >
          <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-green-200 opacity-30"></div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-green-200 opacity-30"></div>
          <h1 className="relative text-4xl md:text-5xl font-bold text-green-800 mb-4 z-10">
            Ecoflare Solutions – Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Last Updated: February 14, 2025. Welcome to Ecoflare Solutions Inc. ("Ecoflare," "we," "us," or "our"), a B2C and B2B fresh produce marketplace platform.
          </p>
        </motion.div>
      </div>

      {/* Table of Contents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-4xl bg-white rounded-xl shadow-sm p-6 mb-12 border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-4">
          <HiOutlineDocumentSearch className="text-green-600 text-2xl" />
          <h3 className="text-xl font-semibold text-gray-800">Table of Contents</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section 1 */}
          <div className="space-y-2">
            <Link
              to="#"
              onClick={() => smoothScrollToId("data-collection")}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition font-medium"
            >
              <FaDatabase className="text-green-500" />
              <span>1. Information We Collect</span>
            </Link>
            <div className="ml-10 space-y-1">
              <Link to="#personal-data" className="block pl-4 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">• Personal Data</Link>
              <Link to="#technical-data" className="block pl-4 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">• Technical Data</Link>
              <Link to="#location-data" className="block pl-4 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">• Location Data</Link>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <Link
              to="#"
              onClick={() => smoothScrollToId("use-of-data")}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition font-medium"
            >
              <FaExchangeAlt className="text-green-500" />
              <span>2. Use of Information</span>
            </Link>
            <div className="ml-10 space-y-1">
              <Link to="#blockchain-use" className="block pl-4 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">• Blockchain Transactions</Link>
              <Link to="#pre-order-model" className="block pl-4 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">• Flexible Buying Models</Link>
              <Link to="#b2b-features" className="block pl-4 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">• B2B Features</Link>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <Link
              to="#"
              onClick={() => smoothScrollToId("third-party")}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition font-medium"
            >
              <FaUserLock className="text-green-500" />
              <span>3. Sharing of Information</span>
            </Link>
            <div className="ml-10 space-y-1">
              <Link to="#service-providers" className="block pl-4 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">• Service Providers</Link>
              <Link to="#trading-partners" className="block pl-4 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">• Trading Partners</Link>
              <Link to="#legal-requirements" className="block pl-4 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">• Legal Requirements</Link>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <Link
              to="#"
              onClick={() => smoothScrollToId("data-security")}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition font-medium"
            >
              <FaShieldAlt className="text-green-500" />
              <span>4. Data Security</span>
            </Link>
            <div className="ml-10 space-y-1">
              <Link to="#blockchain-security" className="block pl-4 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">• Blockchain Security</Link>
              <Link to="#data-encryption" className="block pl-4 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">• Data Encryption</Link>
              <Link to="#access-control" className="block pl-4 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">• Access Control</Link>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <Link
              to="#"
              onClick={() => smoothScrollToId("your-rights")}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition font-medium"
            >
              <FaUserCog className="text-green-500" />
              <span>5. Your Rights & Choices</span>
            </Link>
            <div className="ml-10 space-y-1">
              <Link to="#update-data" className="block pl-4 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">• Update Information</Link>
              <Link to="#delete-data" className="block pl-4 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">• Delete Account</Link>
              <Link to="#cookie-settings" className="block pl-4 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded">• Cookie Settings</Link>
            </div>
          </div>

          {/* Additional Sections */}
          <Link
            to="#"
            onClick={() => smoothScrollToId("children-privacy")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition font-medium"
          >
            <FaUserLock className="text-green-500" />
            <span>6. Children's Privacy</span>
          </Link>

          <Link
            to="#"
            onClick={() => smoothScrollToId("policy-changes")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition font-medium"
          >
            <HiOutlineDocumentSearch className="text-green-500" />
            <span>7. Changes to This Policy</span>
          </Link>

          <Link
            to="#"
            onClick={() => smoothScrollToId("contact-us")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition font-medium"
          >
            <FaUserCog className="text-green-500" />
            <span>8. Contact Us</span>
          </Link>
        </div>
      </motion.div>

      {/* Policy Sections */}
      <div className="w-full max-w-4xl space-y-6 mb-12">
        {/* Data Collection */}
        <motion.div
          id="data-collection"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="flex items-center gap-4 bg-green-50 p-5 border-b border-gray-100">
            <FaDatabase className="text-green-600 text-2xl" />
            <h2 className="text-2xl font-semibold text-gray-800">1. Information We Collect</h2>
          </div>
          <div className="p-6">
            <h3 className="font-medium text-gray-700 mb-2">Personal Data You Provide:</h3>
            <p className="text-gray-600 mb-4">
              We collect personal data when you register for the platform (as a buyer, seller, or both), make or receive a purchase order, engage with our subscription plans (for B2B clients), or participate in surveys, promotions, or communications.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Examples include:</h4>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Name, email address, phone number</li>
                <li>Business or farm name and verification documents (for B2B)</li>
                <li>Payment and billing details</li>
                <li>Communications with our support team</li>
              </ul>
            </div>

            <h3 className="font-medium text-gray-700 mb-2">Non-Identifiable & Technical Data:</h3>
            <p className="text-gray-600 mb-2">
              We use cookies and analytics tools to collect non-personally identifiable data, including:
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-4">
              <li>Browser and device information</li>
              <li>IP address and usage trends</li>
              <li>Site navigation paths and interactions</li>
            </ul>

            <h3 className="font-medium text-gray-700 mb-2">Location Data:</h3>
            <p className="text-gray-600">
              With your permission, our mobile app may collect geolocation data to enable delivery tracking and service optimization.
            </p>
          </div>
        </motion.div>

        {/* Use of Data */}
        <motion.div
          id="use-of-data"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="flex items-center gap-4 bg-green-50 p-5 border-b border-gray-100">
            <FaExchangeAlt className="text-green-600 text-2xl" />
            <h2 className="text-2xl font-semibold text-gray-800">2. Use of Information</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              We use your data to:
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-4">
              <li>Facilitate secure transactions through blockchain-based smart contracts</li>
              <li>Enable the flexible pre-order and tiered pricing model</li>
              <li>Provide customer support, order tracking, and analytics</li>
              <li>Offer personalized user experiences and feature access based on subscription level (for B2B clients)</li>
              <li>Ensure transparency and compliance for both B2C and B2B interactions</li>
            </ul>
          </div>
        </motion.div>

        {/* Third-Party Sharing */}
        <motion.div
          id="third-party"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="flex items-center gap-4 bg-green-50 p-5 border-b border-gray-100">
            <FaUserLock className="text-green-600 text-2xl" />
            <h2 className="text-2xl font-semibold text-gray-800">3. Sharing of Information</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              We may share your data with:
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-4">
              <li>Service providers (e.g., payment processors, hosting services)</li>
              <li>Verified trading partners (as part of smart contract execution)</li>
              <li>Regulatory bodies if legally required</li>
            </ul>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="font-medium text-blue-700">
                We do not sell your personal information.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Data Security */}
        <motion.div
          id="data-security"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="flex items-center gap-4 bg-green-50 p-5 border-b border-gray-100">
            <FaShieldAlt className="text-green-600 text-2xl" />
            <h2 className="text-2xl font-semibold text-gray-800">4. Data Security</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              We implement advanced security protocols to protect your data:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-700 mb-2">Blockchain Security</h4>
                <p className="text-gray-600 text-sm">Blockchain-based smart contracts to ensure transaction integrity</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-700 mb-2">Encryption</h4>
                <p className="text-gray-600 text-sm">Encryption for sensitive data in transit and at rest</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-700 mb-2">Access Control</h4>
                <p className="text-gray-600 text-sm">Limited access to your information by authorized personnel only</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* User Rights */}
        <motion.div
          id="your-rights"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="flex items-center gap-4 bg-green-50 p-5 border-b border-gray-100">
            <FaUserCog className="text-green-600 text-2xl" />
            <h2 className="text-2xl font-semibold text-gray-800">5. Your Rights & Choices</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              You may:
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-4">
              <li>Update or correct your personal data in your account settings</li>
              <li>Request deletion of your account and associated data</li>
              <li>Disable cookies in your browser settings</li>
            </ul>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <p className="text-purple-600">
                Note: Certain data may be retained for legal or operational purposes.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Children's Privacy */}
        <motion.div
          id="children-privacy"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Children's Privacy</h2>
            <p className="text-gray-600">
              Our Services are not directed to individuals under 18. We do not knowingly collect data from minors.
            </p>
          </div>
        </motion.div>

        {/* Policy Changes */}
        <motion.div
          id="policy-changes"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">7. Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last Updated" date.
            </p>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          id="contact-us"
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">8. Contact Us</h2>
            <p className="text-gray-600 mb-2">
              If you have any questions about this Privacy Policy or our data practices, contact:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium">Ecoflare Solutions Inc.</p>
              <p>Email: info@ecoflaresolutions.com</p>
              <p>Address: Ecoflare Solutions Inc., Canada</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-gray-500 text-sm"
      >
        Copyright © 2025 Ecoflare Solutions Inc. All Rights Reserved.
      </motion.div>
    </div>
  );
}