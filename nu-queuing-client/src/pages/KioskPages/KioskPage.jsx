import { useState } from "react";
import { useNavigate } from "react-router-dom";
import nuhorilogoBlue from "../../assets/images/nulogohorizontal-blue.jpg";
const KioskPage = () => {
  const [showGuide, setShowGuide] = useState(false);
  const navigate = useNavigate();
  const handleButtonClick = (userType) => {
    localStorage.setItem("userType", userType);
    // In a real app, you would navigate to the next page
    navigate("/kiosk/department");
    // alert(`User type set to: ${userType}. Next page would load.`);
  };

  return (
    <div className="min-h-screen bg-nu-blue overflow-hidden relative font-clan-ot">
      {/* Background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-nu-blue rounded-full filter blur-[40px] opacity-20 top-[-180px] left-[-180px]"></div>
        <div className="absolute w-[400px] h-[400px] bg-nu-gold rounded-full filter blur-[40px] opacity-20 bottom-[-120px] right-[-120px]"></div>
        <div className="absolute w-[300px] h-[300px] bg-nu-blue rounded-full filter blur-[40px] opacity-10 bottom-[10%] left-[10%]"></div>
        <div className="absolute w-[200px] h-[200px] bg-nu-gold rounded-full filter blur-[40px] opacity-10 top-[20%] right-[15%]"></div>
      </div>

      <div className="flex flex-row h-screen items-stretch justify-stretch relative">
        {/* Left Panel */}
        <div className="flex flex-1 flex-col items-center justify-center bg-white text-[#32418C] rounded-br-[40px] rounded-tr-[40px] md:border-r-8 border-[#FBD117] shadow-lg">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <img
              src={nuhorilogoBlue}
              alt="NU Logo"
              className="absolute top-10 left-1/2 -translate-x-1/2 w-4/5 max-w-[300px]"
            />
            <div className="text-center px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-nu-blue mb-4">
                Get your Queue Number.
              </h1>
              <p className="text-xl text-nu-blue/80 mb-8">
                Choose your transaction type to join the line.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-5 md:p-1 relative">
          <div className="w-full max-w-lg">
            <button
              onClick={() => handleButtonClick("New Student")}
              className="w-full bg-white rounded-3xl shadow-xl p-8 mb-12 flex items-center hover:bg-nu-gold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group"
            >
              <div className="mr-8 ">
                <div className="bg-nu-blue rounded-full w-20 h-20 flex items-center justify-center">
                  <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center">
                    <div className="bg-nu-blue rounded-full w-8 h-8"></div>
                  </div>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-nu-blue mb-4 group-hover:text-nu-blue">
                  New Student
                </h3>
                <p className="text-gray-500 group-hover:text-nu-blue">
                  Queue for new student enrollment and services.
                </p>
              </div>
            </button>

            <button
              onClick={() => handleButtonClick("Priority")}
              className="w-full bg-white rounded-3xl shadow-xl p-8 mb-12 flex items-center hover:bg-nu-gold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group"
              // style={{
              //   boxShadow:
              //     "0 0 0 12px rgba(251, 209, 23, 0.2), 0 12px 48px rgba(50, 65, 140, 0.18)",
              // }}
            >
              <div className="mr-8 ">
                <div className="bg-nu-blue rounded-full w-20 h-20 flex items-center justify-center">
                  <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center">
                    <div className="bg-nu-blue rounded-full w-8 h-8"></div>
                  </div>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-nu-blue mb-4">
                  Priority
                </h3>
                <p className="text-nu-blue/90">
                  Queue for seniors, PWDs, pregnant, and other priority clients.
                </p>
              </div>
              <div className="absolute left-0 right-0 -bottom-8 text-center text-nu-blue font-medium text-sm">
                Priority service available
              </div>
            </button>
            <button
              onClick={() => handleButtonClick("Continuing Student")}
              className="w-full bg-white rounded-3xl shadow-xl p-8 mb-12 flex items-center hover:bg-nu-gold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group"
            >
              <div className="mr-8 ">
                <div className="bg-nu-blue rounded-full w-20 h-20 flex items-center justify-center">
                  <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center">
                    <div className="bg-nu-blue rounded-full w-8 h-8"></div>
                  </div>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-nu-blue mb-4 group-hover:text-nu-blue">
                  Continuing
                </h3>
                <p className="text-gray-500 group-hover:text-nu-blue">
                  Queue for continuing student enrollment and services.
                </p>
              </div>
            </button>
            <button
              onClick={() => setShowGuide(true)}
              className="mt-5 text-nu-gold underline text-center w-full"
            >
              View Enrollment Guide
            </button>
          </div>
        </div>
      </div>

      {/* Enrollment Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-6 text-3xl text-nu-blue font-bold hover:text-nu-gold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-nu-blue text-center mb-6">
              Enrollment Guide
            </h2>

            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <span className="bg-nu-gold text-nu-blue font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                  1
                </span>
                <p>
                  <strong>Step 1:</strong> Submit your documents to the
                  Admissions Office.
                </p>
              </li>
              <li className="flex items-start">
                <span className="bg-nu-blue text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                  2
                </span>
                <p>
                  <strong>Step 2:</strong> Wait for assessment and eligibility
                  check.
                </p>
              </li>
              <li className="flex items-start">
                <span className="bg-nu-gold text-nu-blue font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                  3
                </span>
                <p>
                  <strong>Step 3:</strong> Pay your tuition and other fees at
                  the Treasury Office.
                </p>
              </li>
              <li className="flex items-start">
                <span className="bg-nu-blue text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                  4
                </span>
                <p>
                  <strong>Step 4:</strong> Claim your Certificate of
                  Registration (COR).
                </p>
              </li>
            </ul>

            <p className="text-gray-500 text-center">
              Follow these steps to complete your enrollment smoothly!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KioskPage;
