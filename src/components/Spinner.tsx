export function Spinner({ size = 48 }: { size?: number }) {
    return (
      <div className="flex items-center justify-center w-full py-16">
        <svg
          className="animate-spin text-blue-500"
          width={size}
          height={size}
          viewBox="0 0 50 50"
        >
          <circle
            className="opacity-30"
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="5"
            fill="none"
          />
          <circle
            className="opacity-80"
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="5"
            fill="none"
            strokeDasharray="90"
            strokeDashoffset="60"
          />
        </svg>
      </div>
    );
  }