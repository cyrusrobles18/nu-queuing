import { motion } from "framer-motion";
import nuLogo from "../../assets/images/nulogohorizontal-blue.jpg";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0e7ff] via-[#fbd1170a] to-[#32418c0a] font-clan-ot relative overflow-hidden">
      {/* Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-3xl shadow-2xl px-10 py-14 max-w-2xl w-full flex flex-col items-center relative z-10"
      >
        <motion.img
          src={nuLogo}
          alt="NU Logo"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="w-48 mb-6 drop-shadow-lg select-none pointer-events-none"
        />
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-4xl md:text-5xl font-extrabold text-[#32418C] mb-4 text-center drop-shadow-lg"
        >
          Welcome to NU Queuing System
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-lg md:text-xl text-gray-700 mb-8 text-center max-w-xl"
        >
          Experience a seamless, efficient, and modern way to manage your university transactions. Skip the lines, track your queue in real-time, and enjoy a hassle-free process for all your academic and administrative needs.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col md:flex-row gap-6 w-full justify-center"
        >
          <a
            href="/kiosk"
            className="bg-[#32418C] text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:bg-[#25306b] transition text-lg text-center backdrop-blur-md bg-opacity-80"
          >
            Get Queue Number
          </a>
          <a
            href="/auth"
            className="bg-white/70 text-[#32418C] font-semibold px-8 py-4 rounded-xl shadow-lg border border-[#32418C]/20 hover:bg-[#fbd117] hover:text-[#32418C] transition text-lg text-center backdrop-blur-md"
          >
            Staff/Admin Login
          </a>
        </motion.div>
      </motion.div>
      {/* Animated Background Circles */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-[#32418C]/20 rounded-full blur-3xl z-0"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="absolute bottom-0 right-0 w-80 h-80 bg-[#FBD117]/30 rounded-full blur-2xl z-0"
      />
    </div>
  );
};

export default HomePage;