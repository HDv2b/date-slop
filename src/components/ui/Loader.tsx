"use client";

import React, { useEffect, useState } from "react";

const Loader = () => {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 10000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="animate-fadeIn opacity-0">
      <div className="relative mx-auto h-[37.5px] w-[50px] animate-pulse rounded-full bg-gray-200 before:absolute before:top-[25px] before:left-[-7.5px] before:box-border before:rotate-45 before:border-[7.5px] before:border-t-[12.5px] before:border-transparent before:border-t-gray-200 before:content-[''] after:absolute after:top-1/2 after:left-1/2 after:h-[6px] after:w-[6px] after:-translate-x-1/2 after:-translate-y-1/2 after:[animation:flash_0.5s_ease-out_infinite_alternate] after:rounded-full after:bg-[#FF3D00] after:shadow-[10px_0_#FF3D00,-10px_0_#FF3D00] after:content-['']">
        <style>
          {`
            @keyframes flash {
              0% {
                background-color: rgba(255, 60, 0, 0.25);
                box-shadow: 10px 0 rgba(255, 60, 0, 0.25), -10px 0 #FF3D00;
              }
              50% {
                background-color: #FF3D00;
                box-shadow: 10px 0 rgba(255, 60, 0, 0.25), -10px 0 rgba(255, 60, 0, 0.25);
              }
              100% {
                background-color: rgba(255, 60, 0, 0.25);
                box-shadow: 10px 0 #FF3D00, -10px 0 rgba(255, 60, 0, 0.25);
              }
            }
            
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-fadeIn {
              animation: fadeIn 1s linear forwards;
            }
          `}
        </style>
      </div>
      {slow && (
        <div className="mt-2 text-center text-sm text-gray-600">
          Sorry if this is taking a while, I'm on the free tier!
        </div>
      )}
    </div>
  );
};

export default Loader;
