import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import buildingLineArt from "../../assets/images/building-lineart.png";
import { createQueue, fetchQueuesByDepartment } from "../../services/QueueService";
const KioskDeptPage = () => {
  const [selectedOffice, setSelectedOffice] = useState("treasury");
  const [activeModal, setActiveModal] = useState(null);
  const [queueNumber, setQueueNumber] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [userType] = useState(
    localStorage.getItem("userType") || "New Student"
  );
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const modalData = {
    treasury: {
      title: "Treasury Office Transactions",
      transactions: [
        {
          title: "Payment for Balance",
          desc: "Settle your outstanding balance.",
        },
        {
          title: "Payment for Enrollment",
          desc: "Pay for your enrollment fees.",
        },
        {
          title: "Payment for Promi",
          desc: "Pay for promissory note.",
        },
        {
          title: "Others",
          desc: "Other treasury-related transactions.",
        },
        {
          title: "Validation Concerns",
          desc: "Concerns regarding validation.",
        },
      ],
    },
    registrar: {
      title: "Registrar Office Transactions",
      transactions: [
        {
          title: "Request Assessment",
          desc: "Request for Assessment Form.",
        },
        {
          title: "Request COR",
          desc: "Request for Certificate of Registration.",
        },
        {
          title: "Request TOR",
          desc: "Request for Transcript of Records.",
        },
        {
          title: "Request CTC",
          desc: "Request for Certified True Copy.",
        },
        {
          title: "Request for Dismissal",
          desc: "Request for dismissal documents.",
        },
        {
          title: "Others",
          desc: "Other registrar-related transactions.",
        },
        {
          title: "Validation Concerns",
          desc: "Concerns regarding validation.",
        },
      ],
    },
    admissions: {
      title: "Admissions Office Transactions",
      transactions: [
        {
          title: "Enrollment",
          desc: "Enrollment process.",
        },
        {
          title: "Submission of Documents",
          desc: "Submit your admission documents.",
        },
        {
          title: "Others",
          desc: "Other admissions-related transactions.",
        },
        {
          title: "Validation Concerns",
          desc: "Concerns regarding validation.",
        },
      ],
    },
  };

  const handleCardClick = (office) => {
    setSelectedOffice(office);
    setSelectedTransaction("");
    setActiveModal("transaction");
  };

  const handleContinue = () => {
    setActiveModal("queue");
    setCountdown(5);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          generateQueueNumber();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const generateQueueNumber = async () => {
    const prefixes = {
      treasury: "TRE",
      registrar: "REG",
      admissions: "ADM",
    };

    // Fetch latest queue for the department
    let nextNum = 1;
    try {
      const { data } = await fetchQueuesByDepartment(selectedOffice);
      if (Array.isArray(data) && data.length > 0) {
        // Find the max number after the prefix
        const max = data.reduce((acc, q) => {
          const match = String(q.queueNumber || "").match(/\d+$/);
          const num = match ? parseInt(match[0], 10) : 0;
          return num > acc ? num : acc;
        }, 0);
        nextNum = max + 1;
      }
    } catch (err) {
      nextNum = 1;
    }
    const queueNum = `${prefixes[selectedOffice]}${String(nextNum).padStart(4, "0")}`;
    setQueueNumber(queueNum);
    setActiveModal("queueNumber");
    // Do NOT create queue here
  };

  const handleClose = () => {
    setActiveModal("screenshotConfirm");
  };

  const confirmScreenshot = async () => {
    setActiveModal(null);
    // Create queue in backend only after user confirms screenshot
    try {
      await createQueue({
        department: selectedOffice,
        transaction: selectedTransaction,
        windowNumber: "",
        priority:
          userType == "Priority" || userType == "New Student" ? true : false,
        queueNumber: queueNumber,
        createdAt: new Date(),
        status: "Waiting",
      });
    } catch (err) {
      // Optionally handle error
      console.error("Failed to create queue:", err);
    }
    // Redirect to landing page
    navigate("/kiosk");
  };

  const cancelTransaction = () => {
    setActiveModal("exitConfirm");
  };

  const confirmCancel = () => {
    navigate("/kiosk");
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative font-clan-ot">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#32418C1A] to-[#32418C0A]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#FBD1171A] to-[#FBD1170F]"></div>
        <img
          src={buildingLineArt}
          alt="NU Building Line Art"
          className="w-full h-full object-cover opacity-20 grayscale contrast-110 sepia-20 hue-rotate-[-20deg] brightness-110 mix-blend-lighten"
        />
      </div>

      {/* User Type Indicator */}
      <div
        className={`fixed top-6 right-8 z-50 bg-white text-nu-blue rounded-2xl shadow-md px-6 py-2 text-lg font-semibold tracking-wide flex items-center justify-center border-2 transition-all
        ${
          userType === "Priority"
            ? "border-nu-blue bg-nu-blue text-nu-gold"
            : "border-gray-200"
        }`}
      >
        {userType === "Priority"
          ? "Priority Queue"
          : userType === "Continuing Student"
          ? "Continuing Student Queue"
          : "New Student Queue"}
      </div>

      {/* Cancel Button */}
      <button
        onClick={cancelTransaction}
        className="fixed top-6 left-8 z-50 bg-nu-blue text-white rounded-full w-10 h-10 shadow-md flex items-center justify-center text-2xl font-semibold transition-transform hover:bg-nu-blue-dark hover:scale-105"
      >
        &lt;
      </button>

      <div className=" flex flex-row h-screen items-stretch justify-stretch pt-0 relative">
        {/* Left Panel */}
        <div className="flex-1 bg-nu-blue text-white flex flex-col items-center justify-center h-screen min-w-0 max-w-none rounded-r-[40px] shadow-[4px_0_32px_#32418c11]">
          <div className="flex flex-col justify-center h-full w-full max-w-[90%]">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 tracking-wide text-left max-w-full break-words">
              Which department do you want to queue for?
            </h1>
            <p className="text-white text-xl opacity-85 font-normal tracking-wide text-left">
              Please select your desired office.
            </p>
          </div>
        </div>

        <div className="w-0.5 min-w-0.5 max-w-0.5 h-[70%] bg-gradient-to-b from-[#ececec] to-[#e0e0e0] rounded mx-10 shadow-[0_0_8px_0_#e0e0e033] self-center" />

        {/* Right Panel */}
        <div className="flex-1 px-4 md:px-16 bg-transparent flex flex-col justify-center items-center h-screen">
          <div className="flex flex-col gap-12 my-10 w-full items-center">
            {["treasury", "registrar", "admissions"].map((office) => (
              <DepartmentCard
                key={office}
                office={office}
                onClick={() => handleCardClick(office)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      {activeModal === "transaction" && (
        <Modal>
          <h2 className="text-nu-blue text-2xl font-bold mb-5 text-center max-w-[90%] mx-auto">
            {modalData[selectedOffice].title}
          </h2>
          <div className="w-full mb-8">
            {modalData[selectedOffice].transactions.map((tx, index) => (
              <button
                key={index}
                className={`flex items-start bg-gray-50 rounded-2xl shadow-sm p-5 mb-4 w-full text-left border-2 transition-colors ${selectedTransaction === tx.title ? "border-nu-blue bg-blue-50" : "border-transparent"}`}
                onClick={() => setSelectedTransaction(tx.title)}
              >
                <span className="mr-6 flex items-center justify-center w-12 h-12">
                  {/* Optionally add icons here if needed */}
                </span>
                <div>
                  <span className="block text-nu-blue text-xl font-semibold mb-1">
                    {tx.title}
                  </span>
                  <span className="block text-gray-500">{tx.desc}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-4 w-full mt-3">
            <button
              onClick={() => setActiveModal(null)}
              className="bg-white text-red-500 border-2 border-red-500 rounded-lg text-lg font-semibold px-7 py-2 transition-colors hover:bg-red-500 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="bg-nu-blue text-white rounded-lg text-lg font-semibold px-7 py-2 transition-colors hover:bg-nu-blue-dark disabled:opacity-50"
              disabled={!selectedTransaction}
            >
              Continue
            </button>
          </div>
        </Modal>
      )}

      {/* Queue Modal */}
      {activeModal === "queue" && (
        <Modal>
          <h2 className="text-nu-blue text-2xl font-bold mb-5 text-center">
            Getting your Queue Number
          </h2>
          <p className="text-gray-700 text-lg text-center mb-6">
            Please wait for your turn at the{" "}
            <strong className="text-nu-blue">
              {selectedOffice.charAt(0).toUpperCase() + selectedOffice.slice(1)}
            </strong>
            . You will be called shortly.
          </p>
          <p className="text-gray-500 text-sm text-center mt-3 opacity-85">
            This message will auto-close in {countdown} second
            {countdown !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-3 my-8 justify-center items-center">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${
                  i === 2 ? "bg-nu-gold" : "bg-nu-blue"
                } animate-bounce`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </Modal>
      )}

      {/* Queue Number Modal */}
      {activeModal === "queueNumber" && (
        <Modal>
          <button
            onClick={handleClose}
            className="absolute top-4 right-6 bg-transparent border-none text-nu-blue text-3xl font-bold cursor-pointer transition-colors hover:text-nu-gold"
          >
            &times;
          </button>
          <h2 className="text-nu-blue text-2xl font-bold mb-2 text-center">
            Your{" "}
            {selectedOffice.charAt(0).toUpperCase() + selectedOffice.slice(1)}{" "}
            Office Queue Number
          </h2>
          <div className="text-nu-blue text-7xl font-bold my-8 tracking-wider">
            {queueNumber}
          </div>
          <p className="text-gray-500 text-xl text-center">
            Please{" "}
            <span className="font-bold text-nu-blue">take a screenshot</span> of
            your queue number for your reference.
          </p>
        </Modal>
      )}

      {/* Screenshot Confirmation Modal */}
      {activeModal === "screenshotConfirm" && (
        <Modal>
          <h2 className="text-nu-blue text-2xl font-bold mb-4 text-center">
            Did you take a screenshot?
          </h2>
          <p className="text-nu-blue text-lg text-center mb-8">
            Please make sure you have a copy of your queue number before closing
            this window.
          </p>
          <div className="flex gap-6 justify-center">
            <button
              onClick={confirmScreenshot}
              className="bg-nu-blue text-white rounded-lg text-lg font-semibold px-7 py-2 transition-colors hover:bg-nu-blue-dark"
            >
              Yes, I did
            </button>
            <button
              onClick={() => setActiveModal("queueNumber")}
              className="bg-white text-red-500 border-2 border-red-500 rounded-lg text-lg font-semibold px-7 py-2 transition-colors hover:bg-red-500 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* Exit Confirmation Modal */}
      {activeModal === "exitConfirm" && (
        <Modal>
          <h2 className="text-nu-blue text-2xl font-bold mb-4 text-center">
            Cancel Transaction?
          </h2>
          <p className="text-nu-blue text-lg text-center mb-8">
            Are you sure you want to cancel your current transaction and return
            to the main menu?
          </p>
          <div className="flex gap-6 justify-center">
            <button
              onClick={confirmCancel}
              className="bg-red-500 text-white rounded-lg text-lg font-semibold px-7 py-2 transition-colors hover:bg-red-600"
            >
              Yes, Cancel
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="bg-nu-blue text-white rounded-lg text-lg font-semibold px-7 py-2 transition-colors hover:bg-nu-blue-dark"
            >
              No, Continue
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Sub-components
const Modal = ({ children }) => (
  <>
    <div className="fixed inset-0 bg-[#32418C2E] flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 min-w-[340px] max-w-[90vw] relative flex flex-col items-center">
        {children}
      </div>
    </div>
    <div className="fixed inset-0 bg-white/20 backdrop-blur z-[999]" />
  </>
);

const DepartmentCard = ({ office, onClick }) => {
  const officeData = {
    treasury: {
      title: "Treasury",
      desc: "Queue for payments, fees, and other treasury services.",
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <ellipse cx="32" cy="48" rx="20" ry="10" fill="#FBD117" />
          <ellipse
            cx="32"
            cy="40"
            rx="20"
            ry="10"
            fill="#FBD117"
            opacity="0.7"
          />
          <ellipse cx="32" cy="32" rx="20" ry="10" fill="#32418C" />
          <text
            x="32"
            y="38"
            textAnchor="middle"
            fontSize="18"
            fontFamily="Poppins, Arial"
            fill="white"
            fontWeight="bold"
          >
            ₱
          </text>
        </svg>
      ),
    },
    registrar: {
      title: "Registrar",
      desc: "Queue for student records, documents, and registration services.",
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="14" y="10" width="36" height="44" rx="8" fill="#32418C" />
          <rect x="20" y="20" width="24" height="4" rx="2" fill="#FBD117" />
          <rect x="20" y="30" width="24" height="4" rx="2" fill="#FBD117" />
          <rect x="20" y="40" width="16" height="4" rx="2" fill="#FBD117" />
          <rect x="20" y="50" width="10" height="4" rx="2" fill="#32418C" />
        </svg>
      ),
    },
    admissions: {
      title: "Admissions",
      desc: "Queue for admissions, entrance, and application services.",
      icon: (
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="12" y="12" width="40" height="40" rx="10" fill="#32418C" />
          <rect x="20" y="24" width="24" height="4" rx="2" fill="#FBD117" />
          <rect x="20" y="32" width="16" height="4" rx="2" fill="#FBD117" />
          <polyline
            points="24,44 30,50 44,36"
            stroke="#FBD117"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  };

  const { title, desc, icon } = officeData[office];

  return (
    <button
      onClick={onClick}
      className="flex items-center bg-white border-none rounded-2xl shadow-lg p-8 w-full max-w-4xl cursor-pointer transition-all hover:shadow-xl hover:scale-[1.03] focus:outline-none focus:ring-8 focus:ring-nu-gold/20 active:translate-y-0.5 active:scale-[0.98]"
    >
      <span className="mr-12 flex items-center justify-center w-12 h-12">
        {icon}
      </span>
      <div className="text-left">
        <span className={`block text-3xl font-semibold mb-4 ${office}`}>
          {title}
        </span>
        <span className="block text-gray-500 text-lg">{desc}</span>
      </div>
    </button>
  );
};

// SVG Icons
const treasuryIcon = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <ellipse cx="20" cy="30" rx="16" ry="7" fill="#FBD117" />
    <ellipse cx="20" cy="24" rx="16" ry="7" fill="#32418C" />
    <text
      x="20"
      y="28"
      textAnchor="middle"
      fontSize="14"
      fontFamily="Poppins, Arial"
      fill="white"
      fontWeight="bold"
    >
      ₱
    </text>
  </svg>
);

const receiptIcon = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="8" y="8" width="24" height="24" rx="6" fill="#32418C" />
    <rect x="12" y="16" width="16" height="4" rx="2" fill="#FBD117" />
  </svg>
);

const refundIcon = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="8" y="8" width="24" height="24" rx="6" fill="#FBD117" />
    <rect x="12" y="16" width="16" height="4" rx="2" fill="#32418C" />
  </svg>
);

const servicesIcon = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <ellipse cx="20" cy="20" rx="16" ry="7" fill="#32418C" />
    <ellipse cx="20" cy="28" rx="16" ry="7" fill="#FBD117" />
  </svg>
);

const transcriptIcon = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="8" y="8" width="24" height="24" rx="6" fill="#32418C" />
    <rect x="12" y="16" width="16" height="4" rx="2" fill="#FBD117" />
  </svg>
);

const verificationIcon = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="8" y="8" width="24" height="24" rx="6" fill="#FBD117" />
    <rect x="12" y="16" width="16" height="4" rx="2" fill="#32418C" />
  </svg>
);

const authenticationIcon = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <ellipse cx="20" cy="20" rx="16" ry="7" fill="#32418C" />
    <ellipse cx="20" cy="28" rx="16" ry="7" fill="#FBD117" />
  </svg>
);

const recordsIcon = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <ellipse cx="20" cy="30" rx="16" ry="7" fill="#FBD117" />
    <ellipse cx="20" cy="24" rx="16" ry="7" fill="#32418C" />
  </svg>
);

const applicationIcon = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="8" y="8" width="24" height="24" rx="6" fill="#32418C" />
    <rect x="12" y="16" width="16" height="4" rx="2" fill="#FBD117" />
  </svg>
);

const examIcon = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <rect x="8" y="8" width="24" height="24" rx="6" fill="#FBD117" />
    <rect x="12" y="16" width="16" height="4" rx="2" fill="#32418C" />
  </svg>
);

const requirementsIcon = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <ellipse cx="20" cy="20" rx="16" ry="7" fill="#32418C" />
    <ellipse cx="20" cy="28" rx="16" ry="7" fill="#FBD117" />
  </svg>
);

const statusIcon = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <ellipse cx="20" cy="30" rx="16" ry="7" fill="#FBD117" />
    <ellipse cx="20" cy="24" rx="16" ry="7" fill="#32418C" />
  </svg>
);

export default KioskDeptPage;
