import React from "react";

const QRLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64 w-64">
      <div className="relative w-44 h-44">
        {/* Core chip */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-background to-muted shadow-lg flex items-center justify-center">
          <div className="w-32 h-32 rounded-md bg-background border-2 border-primary/40 relative overflow-hidden">
            {/* QR finder patterns */}
            {/* Top-left */}
            <div className="absolute top-2 left-2 w-8 h-8 border-2 border-primary/60 p-1">
              <div className="w-full h-full border-2 border-primary/60 bg-primary/30 p-1">
                <div className="w-full h-full bg-primary/60"></div>
              </div>
            </div>
            {/* Top-right */}
            <div className="absolute top-2 right-2 w-8 h-8 border-2 border-primary/60 p-1">
              <div className="w-full h-full border-2 border-primary/60 bg-primary/30 p-1">
                <div className="w-full h-full bg-primary/60"></div>
              </div>
            </div>
            {/* Bottom-left */}
            <div className="absolute bottom-2 left-2 w-8 h-8 border-2 border-primary/60 p-1">
              <div className="w-full h-full border-2 border-primary/60 bg-primary/30 p-1">
                <div className="w-full h-full bg-primary/60"></div>
              </div>
            </div>

            {/* Simulated QR modules (animating in) */}
            <div className="absolute inset-6 grid grid-cols-5 gap-1">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-primary/30 opacity-0 animate-[appear_0.5s_ease-in_forwards]"
                  style={{ animationDelay: `${Math.random() * 1.5}s` }}
                />
              ))}
            </div>

            {/* Horizontal scanning beam */}
            <div className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-[beam_2s_ease-in-out_infinite]" />
          </div>
        </div>

        {/* Circuit-like outer frame */}
        <div className="absolute inset-0 rounded-lg border-2 border-primary/30 animate-[pulse_3s_ease-in-out_infinite]" />

        {/* Loading text */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm text-muted-foreground tracking-wide animate-fade-in">
          Generating QR...
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes beam {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 8px rgba(0, 200, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 16px rgba(0, 200, 255, 0.4);
          }
        }
        @keyframes appear {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default QRLoading;