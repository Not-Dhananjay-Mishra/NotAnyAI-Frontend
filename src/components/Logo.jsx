export function Logo({ size = "default" }) {
  const sizeClasses = {
    small: "h-8",
    default: "h-10",
    large: "h-12"
  };

  const textSizeClasses = {
    small: "text-lg",
    default: "text-xl",
    large: "text-2xl"
  };

  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} aspect-square relative`}>
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E0E7FF" />
            </linearGradient>
          </defs>

          {/* Main circle background */}
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="url(#logoGradient)"
            className="drop-shadow-lg"
          />

          {/* Inner geometric pattern representing "N" and AI neural network */}
          <g transform="translate(8, 8)">
            {/* Neural network nodes */}
            <circle cx="4" cy="6" r="1.5" fill="url(#innerGradient)" />
            <circle cx="12" cy="4" r="1.5" fill="url(#innerGradient)" />
            <circle cx="20" cy="6" r="1.5" fill="url(#innerGradient)" />
            <circle cx="4" cy="18" r="1.5" fill="url(#innerGradient)" />
            <circle cx="12" cy="20" r="1.5" fill="url(#innerGradient)" />
            <circle cx="20" cy="18" r="1.5" fill="url(#innerGradient)" />

            {/* Connection lines forming "N" shape */}
            <path
              d="M4 6 L4 18 M4 6 L20 18 M20 6 L20 18"
              stroke="url(#innerGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="opacity-90"
            />

            {/* Neural connections */}
            <path
              d="M4 6 L12 4 M12 4 L20 6 M4 18 L12 20 M12 20 L20 18 M4 6 L12 20 M20 6 L12 20"
              stroke="url(#innerGradient)"
              strokeWidth="1"
              strokeLinecap="round"
              className="opacity-60"
            />
          </g>
        </svg>
      </div>

      {/* Logo Text */}
      <div className={`${textSizeClasses[size]} tracking-tight`}>
        <span className="bg-gradient-to-r from-gray-800 via-blue-700 to-blue-900 bg-clip-text text-transparent drop-shadow-sm">
          NotAny
        </span>
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm ml-1">
          AI
        </span>
      </div>
    </div>
  );
}
