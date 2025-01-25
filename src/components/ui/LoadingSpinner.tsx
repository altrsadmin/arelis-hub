import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-[#0099ff] dark:bg-[#2afbc6] animate-[bounce_0.7s_infinite]" />
        <div className="w-2 h-2 rounded-full bg-[#0099ff] dark:bg-[#2afbc6] animate-[bounce_0.7s_0.1s_infinite]" />
        <div className="w-2 h-2 rounded-full bg-[#0099ff] dark:bg-[#2afbc6] animate-[bounce_0.7s_0.2s_infinite]" />
      </div>
    </div>
  );
}