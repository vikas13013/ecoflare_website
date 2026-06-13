// src/pages/TermsAndConditions.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaFileContract,
  FaBalanceScale,
  FaExclamationTriangle,
  FaLock,
  FaShieldAlt,
  FaExchangeAlt,
  FaHandshake,
  FaGavel,
  FaEnvelope,
  FaEllipsisH,
  FaGlobeAmericas
} from "react-icons/fa";

export default function TermsAndConditions() {
  const smoothScrollToId = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 flex flex-col items-center">

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
          EcoFlare Solutions Inc. Terms of Service
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Last Updated: April 30, 2025. These terms govern your use of our B2B/B2C fresh produce marketplace platform.
        </p>
      </motion.div>

      {/* Main Content Container */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">

        {/* Sticky Table of Contents */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:w-1/4 lg:sticky lg:self-start lg:top-8"
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaFileContract className="mr-2 text-green-600" />
              Table of Contents
            </h3>
            <nav className="space-y-3">
              <Link
                to="#"
                onClick={() => smoothScrollToId('acceptance')}
                className="block px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors flex items-center"
              >
                <FaCheckCircle className="mr-2 text-green-500" />
                1. Acceptance of Terms
              </Link>
              <Link
                to="#"
                onClick={() => smoothScrollToId('services')}
                className="block px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors flex items-center"
              >
                <FaShieldAlt className="mr-2 text-green-500" />
                2. Services Definition
              </Link>
              <Link
                to="#"
                onClick={() => smoothScrollToId('use')}
                className="block px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors flex items-center"
              >
                <FaLock className="mr-2 text-green-500" />
                3. Use of Services
              </Link>
              <Link
                to="#transactions"
                onClick={() => smoothScrollToId('transactions')}
                className="block px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors flex items-center"
              >
                <FaExchangeAlt className="mr-2 text-green-500" />
                4. Marketplace Transactions
              </Link>
              <Link
                to="#ip"
                onClick={() => smoothScrollToId('ip')}
                className="block px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors flex items-center"
              >
                <FaFileContract className="mr-2 text-green-500" />
                5. Intellectual Property
              </Link>
              <Link
                to="#warranties"
                onClick={() => smoothScrollToId('warranties')}
                className="block px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors flex items-center"
              >
                <FaHandshake className="mr-2 text-green-500" />
                6. Warranties
              </Link>
              <Link
                to="#termination"
                onClick={() => smoothScrollToId('termination')}
                className="block px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors flex items-center"
              >
                <FaExclamationTriangle className="mr-2 text-green-500" />
                7. Termination
              </Link>
              <Link
                to="#liability"
                onClick={() => smoothScrollToId('liability')}
                className="block px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors flex items-center"
              >
                <FaBalanceScale className="mr-2 text-green-500" />
                9. Liability
              </Link>
              <Link
                to="#indemnification"
                onClick={() => smoothScrollToId('indemnification')}
                className="block px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors flex items-center"
              >
                <FaBalanceScale className="mr-2 text-green-500" />
                10. Indemnification
              </Link>

              <Link
                to="#canadian-government-matters"
                onClick={() => smoothScrollToId('canadian-government-matters')}
                className="block px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors flex items-center"
              >
                <FaGlobeAmericas className="mr-2 text-green-500" />
                11. Canadian Government Matters
              </Link>

              <Link
                to="#assignment"
                onClick={() => smoothScrollToId('assignment')}
                className="block px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors flex items-center"
              >
                <FaExchangeAlt className="mr-2 text-green-500" />
                12. Assignment
              </Link>

              <Link
                to="#miscellaneous"
                onClick={() => smoothScrollToId('miscellaneous')}
                className="block px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors flex items-center"
              >
                <FaEllipsisH className="mr-2 text-green-500" />
                13. Miscellaneous
              </Link>

              <Link
                to="#law"
                onClick={() => smoothScrollToId('law')}
                className="block px-3 py-2 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors flex items-center"
              >
                <FaGavel className="mr-2 text-green-500" />
                14. Governing Law
              </Link>
            </nav>
          </div>

          {/* Quick Summary Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-green-50 rounded-xl p-6 mt-6 border border-green-100"
          >
            <h4 className="font-medium text-green-700 mb-3">Key Provisions</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                Initial 12-month term with automatic renewal
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                24-hour inspection period for deliveries
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                Net 15 payment terms standard
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                Strict food safety requirements for suppliers
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Terms Content */}
        <div className="lg:w-3/4 space-y-8">

          {/* Acceptance Section */}
          <motion.section
            id="acceptance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
                <FaCheckCircle className="mr-3 text-green-600" />
                1. Acceptance of Terms
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>1.1</strong> EcoFlare Solutions Inc. ("EcoFlare" or "we") provides its Services through its website located at https://ecoflaresolutions.com (the "Site"), subject to this Terms of Service Agreement ("TOS"). By accepting this TOS or by accessing or using the Services or Site, you acknowledge that you have read, understood, and agree to be bound by this TOS.
                </p>

                <p>
                  <strong>1.2</strong> If you are entering into this TOS on behalf of a company or other legal entity, you represent that you have the authority to bind such entity. If you do not have such authority, or if you do not agree with these terms, you must not use the Services.
                </p>

                <p>
                  <strong>1.3</strong> You will be required to create an administrative username and password for your account ("Account"). Each Account is limited to one user unless otherwise authorized.
                </p>

                <p>
                  <strong>1.4</strong> EcoFlare may amend this TOS with ten (10) days' prior notice, either by email or by posting updates on the Site. Continued use after changes constitutes acceptance.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Services Section */}
          <motion.section
            id="services"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
                <FaShieldAlt className="mr-3 text-green-600" />
                2. Definitions
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>2.1</strong> The "Services" include: (a) the Site; (b) EcoFlare's proprietary online B2B and B2C marketplace platform for fresh produce; and (c) all software, tools, data, images, and content made available by EcoFlare (collectively, "Content").
                </p>

                <p>
                  <strong>2.2</strong> "Marketplace Transactions" means any purchase or sale of fresh produce via the EcoFlare platform between registered Suppliers and Buyers.
                </p>

                <p>
                  <strong>2.3</strong> The "Term" begins when you create an Account and continues for twelve (12) months ("Initial Term"), automatically renewing for successive six (6) month periods unless either party provides thirty (30) days' written notice of non-renewal.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Use of Services Section */}
          <motion.section
            id="use"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
                <FaLock className="mr-3 text-green-600" />
                3. Use of the Services
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-6 text-gray-600">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">3.1 Non-Circumvention & Non-Competition</h3>
                  <p>
                    During the Term and for one year thereafter, you agree not to: (i) solicit EcoFlare partners to bypass the platform; (ii) solicit any EcoFlare employee; or (iii) operate a competitive online produce marketplace.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">3.2 Lawful Use</h3>
                  <p>
                    You agree to use the Services only for lawful purposes and in compliance with all applicable laws. You will not reproduce, resell, transfer, assign, or exploit the Services without EcoFlare's consent.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">3.3 Intellectual Property</h3>
                  <p>
                    EcoFlare retains all rights to the Services. Any software is licensed, not sold, and may not be copied, reverse-engineered, or sublicensed.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">3.4 Confidentiality</h3>
                  <p>
                    All confidential information obtained from EcoFlare must be treated as proprietary and may not be disclosed outside the scope of this TOS.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Transactions Section */}
          <motion.section
            id="transactions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
                <FaExchangeAlt className="mr-3 text-green-600" />
                4. Orders; Delivery; Acceptance; Payments
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-6 text-gray-600">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">4.1 Marketplace Transactions</h3>
                  <p>
                    EcoFlare facilitates fresh produce sales between Buyers and Suppliers. Delivery logistics, risk of loss, and fulfillment terms are agreed between Buyer and Supplier.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">4.2 Inspection Period</h3>
                  <p>
                    Buyers have 24 hours after receiving goods to report any rejections or issues. If no issues are reported, the order is considered accepted.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">4.3 Payment Terms</h3>
                  <p>
                    Standard payment terms are net fifteen (15) days from delivery. EcoFlare may suspend access for overdue payments and charge late fees.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">4.5 Taxes</h3>
                  <p>
                    All transactions are subject to applicable taxes unless exempt under Canadian law.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* IP Section */}
          <motion.section
            id="ip"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
                <FaFileContract className="mr-3 text-green-600" />
                5. Proprietary Information & Intellectual Property
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>5.1</strong> EcoFlare owns all content, branding, platform software, and underlying intellectual property provided through the Services.
                </p>

                <p>
                  <strong>5.2</strong> You agree not to disclose or use any proprietary information obtained through EcoFlare, except as necessary for transactions.
                </p>

                <p>
                  <strong>5.3</strong> Any feedback you provide may be used by EcoFlare for improvement without compensation.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Warranties Section */}
          <motion.section
            id="warranties"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
                <FaHandshake className="mr-3 text-green-600" />
                6. Representations and Warranties
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-6 text-gray-600">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">General Warranties</h3>
                  <p>
                    You represent that: (i) you have authority to enter this Agreement; (ii) you have all rights to Your Content; (iii) Your Content doesn't violate third-party rights; (iv) you'll comply with all laws including food safety regulations; (v) you have required licenses; and (vi) you're at least 18 years old.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Supplier Warranties</h3>
                  <p>
                    Suppliers warrant that all goods: (i) comply with Canadian food safety laws; (ii) meet CFIA standards; (iii) are fit for human consumption; (iv) are free from major allergens (unless disclosed); (v) aren't adulterated; and (vi) have all required approvals.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Traceability & Recall</h3>
                  <p>
                    Suppliers must maintain traceability programs and recall procedures. Suppliers must immediately notify EcoFlare of any food safety issues and are responsible for recall costs.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Termination Section */}
          <motion.section
            id="termination"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
                <FaExclamationTriangle className="mr-3 text-green-600" />
                7. Termination
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-6 text-gray-600">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">General Termination</h3>
                  <p>
                    EcoFlare may terminate your Account at any time. You may terminate with 30 days' notice if EcoFlare breaches this Agreement. Your Content may be deleted upon termination.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Supplier Termination</h3>
                  <p>
                    Either party may terminate with 10 days' notice for material breach. EcoFlare may terminate for convenience with 30 days' notice. Unpaid amounts remain due.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Buyer Termination</h3>
                  <p>
                    Either party may terminate with 10 days' notice for material breach (5 days for nonpayment). EcoFlare may terminate for convenience with 30 days' notice.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Liability Section */}
          <motion.section
            id="liability"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
                <FaBalanceScale className="mr-3 text-green-600" />
                9. Limitation of Liability
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>9.1</strong> EcoFlare isn't liable for indirect, incidental, special, exemplary, or consequential damages. Direct liability is capped at the amount paid by you in the 6 months before the claim, or CAD 100 if no fees apply.
                </p>

                <p>
                  <strong>9.2</strong> For Buyers, EcoFlare's liability is capped at the lesser of: (i) 100% of fees paid in the 12 months before the incident, or (ii) CAD 25,000.
                </p>
              </div>
            </div>
          </motion.section>


          {/* Indemnification*/}
          <motion.section
            id="indemnification"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
                <FaBalanceScale  className="mr-3 text-green-600" />
                10. Indemnification
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-600">
                <p>
                  You shall indemnify and defend EcoFlare from claims and expenses (including legal fees) arising from your breach of this Agreement, Your Content, or your misuse of the Services. EcoFlare may assume exclusive control of the defense.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Canadian Government Matters*/}
          <motion.section
            id="canadian-government-matters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
                <FaGlobeAmericas  className="mr-3 text-green-600" />
                11. Canadian Government Matters
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-600">
                <p>
                  You may not export or re-export the Services in violation of Canadian law or applicable international restrictions. If applicable, government usage will be governed by commercial terms consistent with applicable procurement rules.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Assignment*/}
          <motion.section
            id="assignment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
                <FaExchangeAlt  className="mr-3 text-green-600" />
                12. Assignment
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-600">
                <p>
                  You may not assign this Agreement without EcoFlare’s consent. EcoFlare may be assigned without restriction. You remain liable for payment obligations regardless of assignment.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Miscellaneous*/}
          <motion.section
            id="miscellaneous"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
                <FaEllipsisH  className="mr-3 text-green-600" />
                13. Miscellaneous
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-600">
                <p>
                  If any part of this Agreement is invalid, the rest remains enforceable. The parties are independent contractors. Notices will be in writing and delivered via email, courier, or certified mail. Notices to EcoFlare should be addressed to: EcoFlare Solutions Inc., [Insert Address], Attn: Legal Department.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Governing Law Section */}
          <motion.section
            id="law"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center">
                <FaGavel className="mr-3 text-green-600" />
                14. Governing Law
              </h2>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-600">
                <p>
                  This Agreement is governed by the laws of the Province of [Insert Province], Canada, excluding its conflict of law principles. The courts of [Insert Province] shall have exclusive jurisdiction. The prevailing party may recover legal fees.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Final Agreement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center"
          >
            <h2 className="text-2xl font-bold mb-4">EcoFlare Solutions Inc. Terms of Service</h2>
            <p className="mb-6 text-green-100">
              Last updated: April 30, 2025
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="bg-white text-green-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg shadow-md transition-all transform hover:scale-105 flex items-center justify-center"
              >
                <FaEnvelope className="mr-2" />
                Contact Legal
              </Link>
              <Link
                to="/privacypolicy"
                className="border-2 border-white text-white hover:bg-white hover:text-green-700 font-semibold py-3 px-8 rounded-lg transition-all flex items-center justify-center"
              >
                <FaShieldAlt className="mr-2" />
                Privacy Policy
              </Link>
            </div>
            <p className="mt-6 text-sm text-green-100">
              COPYRIGHT AND LEGAL NOTICE. Copyright ©2025 EcoFlare Solutions Inc. All Rights Reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}