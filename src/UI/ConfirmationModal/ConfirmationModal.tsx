import React from "react";

interface ModalProps {
  ModalText: string;
  buttonText1?: string;
  buttonText2?: string;
  handleClose?: () => void;
  handleButton1?: () => void;
  handleButton2?: () => void;
}

const ConfirmationModal: React.FC<ModalProps> = ({
  ModalText,
  buttonText1,
  buttonText2,
  handleClose,
  handleButton1,
  handleButton2,
}) => {
  return (
    <>
      <style>
        {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes slideUp {
                        from { 
                            opacity: 0;
                            transform: translateY(20px) scale(0.95);
                        }
                        to { 
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                    
                    .animate-fadeIn {
                        animation: fadeIn 0.3s ease-out;
                    }
                    
                    .animate-slideUp {
                        animation: slideUp 0.4s ease-out;
                    }
                    
                    .animate-pulse {
                        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    }
                    
                    @keyframes pulse {
                        0%, 100% { opacity: 0.1; }
                        50% { opacity: 0.3; }
                    }
                `}
      </style>
      <div
        className="flex justify-center items-center animate-fadeIn"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(8px)",
          zIndex: 9999,
        }}
      >
        <div
          className="flex flex-col gap-8 relative w-[42vw] max-w-[500px] min-w-[320px] rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] animate-slideUp"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
            border: "1px solid rgba(81, 44, 237, 0.1)",
            boxShadow:
              "0 25px 50px -12px rgba(81, 44, 237, 0.25), 0 0 0 1px rgba(81, 44, 237, 0.05)",
          }}
        >
          {/* Decorative elements */}
          <div
            className="absolute -top-1 -left-1 w-16 h-16 rounded-full opacity-20 animate-pulse"
            style={{
              background:
                "radial-gradient(circle, #512CED 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-1 -right-1 w-12 h-12 rounded-full opacity-15 animate-pulse"
            style={{
              background:
                "radial-gradient(circle, #512CED 0%, transparent 70%)",
              animationDelay: "1s",
            }}
          />

          {/* Close button */}
          {handleClose && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-red-50 hover:scale-110 cursor-pointer group border-none bg-transparent"
              style={{ color: "#64748b" }}
            >
              <svg
                className="w-5 h-5 transition-colors duration-200 group-hover:text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Modal content */}
          <div className="pt-2">
            <div
              className="text-lg leading-relaxed"
              style={{
                color: "#1e293b",
                fontFamily:
                  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontWeight: "500",
                letterSpacing: "-0.01em",
              }}
            >
              {ModalText}
            </div>
          </div>

          {/* Button container */}
          <div className="flex gap-3 justify-end items-center pt-2">
            {buttonText1 && (
              <button
                onClick={handleButton1}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer"
                style={{
                  color: "#64748b",
                  fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontWeight: "500",
                  fontSize: "14px",
                  letterSpacing: "-0.01em",
                  backgroundColor: "transparent",
                  border: "1px solid #e2e8f0",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f1f5f9";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                {buttonText1}
              </button>
            )}
            {buttonText2 && (
              <button
                onClick={handleButton2}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer border-none"
                style={{
                  background:
                    "linear-gradient(135deg, #512CED 0%, #6366f1 100%)",
                  color: "#ffffff",
                  fontFamily:
                    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontWeight: "600",
                  fontSize: "14px",
                  letterSpacing: "-0.01em",
                  boxShadow: "0 4px 12px rgba(81, 44, 237, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #4338ca 0%, #512CED 100%)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(81, 44, 237, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #512CED 0%, #6366f1 100%)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(81, 44, 237, 0.3)";
                }}
              >
                {buttonText2}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
