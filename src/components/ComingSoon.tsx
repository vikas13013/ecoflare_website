import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/images/mainlogo.png";
import { useTranslation } from "react-i18next";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const TARGET_DATE = new Date();
TARGET_DATE.setDate(TARGET_DATE.getDate() + 12); // 12 days from now

export default function ComingSoon(): JSX.Element {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(TARGET_DATE));
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(TARGET_DATE));
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log("Email submitted:", email);
    setIsSubscribed(true);
    setEmail("");
  };

  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <motion.div
            className="w-28 h-28 rounded-full bg-white/100 p-3 mb-6 shadow-lg backdrop-blur-sm"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img
              src={logo}
              className="w-full h-full object-contain"
              alt="Pricewise Logo"
            />
          </motion.div>
          <h1 className="text-4xl h-20 sm:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200">
            {t("coming_soon")}
          </h1>
          <p className="text-green-100 text-lg max-w-xl mx-auto leading-relaxed">
            {t("were_preparing_something")}
          </p>
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="bg-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 w-full max-w-lg"
        >
          <h2 className="text-xl font-bold mb-1">{t("launch_countdown")}</h2>
          <p className="text-green-200 text-sm mb-6">{t("get_ready_for_the_future_of_price_tracking")}</p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <TimeBox label={t("days")} value={timeLeft.days} />
            <TimeBox label={t("hours")} value={timeLeft.hours} />
            <TimeBox label={t("minutes")} value={timeLeft.minutes} />
            <TimeBox label={t("minutes")} value={timeLeft.seconds} />
          </div>
        </motion.div> */}

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="w-full max-w-md"
        >
          <h3 className="text-xl font-semibold mb-4">Get Notified When We Launch</h3>
          
          {isSubscribed ? (
            <motion.div 
              className="bg-green-500/20 p-4 rounded-lg border border-green-500/30"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <p className="text-green-100">🎉 Thank you! We'll notify you when we launch.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-green-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <motion.button
                type="submit"
                className="px-6 py-3 bg-white text-green-800 font-semibold rounded-lg hover:bg-green-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Notify Me
              </motion.button>
            </form>
          )}
        </motion.div> */}

        {/* <motion.div
          className="flex space-x-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.36 }}
        >
          <SocialIcon href="#" icon="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
          <SocialIcon href="#" icon="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          <SocialIcon href="#" icon="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
        </motion.div> */}

        {/* <motion.div 
          className="text-sm text-green-200/80 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.48 }}
        >
          © {new Date().getFullYear()} Pricewise — Built with ❤️ for smart shoppers
        </motion.div> */}
      </div>
    </div>
  );
}

// Helper components
// function TimeBox({ label, value }: { label: string; value: number }) {
//   return (
//     <motion.div
//       className="rounded-xl bg-white/10 p-4 border border-white/10 backdrop-blur-sm"
//       whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
//       transition={{ type: "spring", stiffness: 400 }}
//     >
//       <div className="text-2xl sm:text-3xl font-bold leading-none">{String(value).padStart(2, "0")}</div>
//       <div className="text-xs sm:text-sm text-green-200 mt-1 font-medium">{label}</div>
//     </motion.div>
//   );
// }

function SocialIcon({ href, icon }: { href: string; icon: string }) {
  return (
    <motion.a
      href={href}
      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d={icon} />
      </svg>
    </motion.a>
  );
}

function getTimeLeft(target: Date): TimeLeft {
  const now = new Date().getTime();
  const distance = Math.max(0, target.getTime() - now);

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}