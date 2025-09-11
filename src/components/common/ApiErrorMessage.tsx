import { AlertTriangle, RefreshCw } from "lucide-react";

interface ApiErrorMessageProps {
  message: string;
  isNotImplemented?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function ApiErrorMessage({ 
  message, 
  isNotImplemented = false, 
  onRetry,
  className = ""
}: ApiErrorMessageProps) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${
      isNotImplemented 
        ? "bg-yellow-50 border-yellow-200 text-yellow-800" 
        : "bg-red-50 border-red-200 text-red-800"
    } ${className}`}>
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <div>
          <p className="font-medium">
            {isNotImplemented ? "기능 구현 중" : "오류 발생"}
          </p>
          <p className="text-sm mt-1 opacity-90">{message}</p>
        </div>
      </div>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className={`flex items-center space-x-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
            isNotImplemented
              ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
              : "bg-red-100 hover:bg-red-200 text-red-700"
          }`}
        >
          <RefreshCw className="w-3 h-3" />
          <span>재시도</span>
        </button>
      )}
    </div>
  );
}