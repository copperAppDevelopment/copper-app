interface CitySkylineProps {
  className?: string;
  theme?: "light" | "dark";
  variant?: "default" | "translucent-white";
}

interface BuildingDef {
  x: number;
  width: number;
  height: number;
  capType: "flat" | "step-1" | "step-2" | "dome";
  cols: number;
  rows: number;
  depth: "front" | "back";
}

export default function CitySkyline({
  className = "",
  theme,
  variant = "default"
}: CitySkylineProps) {
  // Let's lay out the precise sequence of buildings from the user's uploaded image
  const buildings: BuildingDef[] = [
    { x: 0, width: 55, height: 110, capType: "flat", cols: 2, rows: 4, depth: "front" },
    { x: 63, width: 85, height: 210, capType: "step-1", cols: 3, rows: 7, depth: "back" },
    { x: 156, width: 50, height: 120, capType: "flat", cols: 2, rows: 4, depth: "front" },
    { x: 214, width: 95, height: 245, capType: "dome", cols: 4, rows: 8, depth: "back" },
    { x: 317, width: 70, height: 145, capType: "flat", cols: 2, rows: 4, depth: "front" },
    { x: 395, width: 90, height: 225, capType: "step-2", cols: 3, rows: 7, depth: "back" },
    { x: 493, width: 55, height: 115, capType: "flat", cols: 2, rows: 3, depth: "front" },
    { x: 556, width: 110, height: 250, capType: "flat", cols: 4, rows: 9, depth: "back" },
    { x: 674, width: 72, height: 150, capType: "flat", cols: 2, rows: 4, depth: "front" },
    { x: 754, width: 92, height: 235, capType: "step-1", cols: 3, rows: 7, depth: "back" },
    { x: 854, width: 60, height: 125, capType: "flat", cols: 2, rows: 3, depth: "front" },
    { x: 922, width: 95, height: 220, capType: "step-2", cols: 3, rows: 7, depth: "back" },
    { x: 1025, width: 65, height: 140, capType: "flat", cols: 2, rows: 4, depth: "front" },
    { x: 1098, width: 105, height: 245, capType: "dome", cols: 4, rows: 8, depth: "back" },
    { x: 1211, width: 70, height: 150, capType: "flat", cols: 2, rows: 4, depth: "front" },
    { x: 1289, width: 85, height: 225, capType: "step-1", cols: 3, rows: 7, depth: "back" },
    { x: 1382, width: 58, height: 125, capType: "flat", cols: 2, rows: 3, depth: "front" },
  ];

  return (
    <div className={`relative w-full ${className}`}>
      <svg
        viewBox="0 0 1440 280"
        className="w-full h-[140px] sm:h-[170px] md:h-auto text-current transition-colors duration-300"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        id="skyline-svg"
      >
        <defs>
          {/* Subtle light mode sky horizon shine matching the reference image */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF3F2" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Sky gradient background only visible if light theme context requires it */}
        <rect x="0" y="0" width="1440" height="280" fill="url(#skyGrad)" className="dark:hidden" />

        {buildings.map((b, bIdx) => {
          const y = 280 - b.height;
          
          // Determine fills and strokes for each layer to exactly duplicate the user's color scheme
          // In the image:
          // Front layer is a slightly warmer shade like #E9DDDC
          // Back layer is a lighter pastel shade like #F5ECEB
          // Windows are clean white #FFFFFF on both layers
          // Dark mode uses deep slate/zinc coordinates with soft glowing outline window grids
          const isFront = b.depth === "front";
          
          const fillClass = variant === "translucent-white"
            ? (isFront ? "fill-white/10" : "fill-white/5")
            : (isFront ? "fill-[#E9DDDC] dark:fill-zinc-900/65" : "fill-[#F5ECEB] dark:fill-zinc-800/45");

          const windowClass = variant === "translucent-white"
            ? (isFront ? "fill-white/20" : "fill-white/15")
            : (isFront ? "fill-white/95 dark:fill-zinc-800/85" : "fill-white/95 dark:fill-zinc-700/65");

          // Calculate window dimensions dynamically
          const marginX = 12;
          const marginTop = 15;
          const availW = b.width - (2 * marginX);
          const gapX = 4;
          const gapY = 6;
          const winW = (availW - (b.cols - 1) * gapX) / b.cols;
          const winH = 1.35 * winW; // beautiful rectangular modern windows matching image

          // Generate windows matrix programmatically
          const windows: { x: number; y: number }[] = [];
          for (let r = 0; r < b.rows; r++) {
            const winY = y + marginTop + r * (winH + gapY);
            // Don't render windows too close to the bottom ground line
            if (winY + winH > 280 - 15) continue;

            for (let c = 0; c < b.cols; c++) {
              const winX = b.x + marginX + c * (winW + gapX);
              windows.push({ x: winX, y: winY });
            }
          }

          return (
            <g key={bIdx} id={`building-${bIdx}`}>
              {/* Optional cap/roof overlay based on architectural blueprint */}
              {b.capType === "step-1" && (
                <rect
                  x={b.x + 8}
                  y={y - 12}
                  width={b.width - 16}
                  height={12}
                  rx={2}
                  className={fillClass}
                />
              )}

              {b.capType === "step-2" && (
                <>
                  <rect
                    x={b.x + 6}
                    y={y - 8}
                    width={b.width - 12}
                    height={8}
                    rx={2}
                    className={fillClass}
                  />
                  <rect
                    x={b.x + 16}
                    y={y - 18}
                    width={b.width - 32}
                    height={10}
                    rx={2}
                    className={fillClass}
                  />
                </>
              )}

              {b.capType === "dome" && (
                <>
                  <rect
                    x={b.x + 8}
                    y={y - 8}
                    width={b.width - 16}
                    height={8}
                    rx={2}
                    className={fillClass}
                  />
                  <rect
                    x={b.x + 18}
                    y={y - 18}
                    width={b.width - 36}
                    height={10}
                    rx={2}
                    className={fillClass}
                  />
                  <path
                    d={`M ${b.x + b.width / 2 - 12} ${y - 18} A 12 12 0 0 1 ${b.x + b.width / 2 + 12} ${y - 18} Z`}
                    className={fillClass}
                  />
                </>
              )}

              {/* Main building body rectangle */}
              <rect
                x={b.x}
                y={y}
                width={b.width}
                height={b.height}
                className={fillClass}
              />

              {/* Window grid matching the reference image */}
              {windows.map((w, wIdx) => (
                <rect
                  key={wIdx}
                  x={w.x}
                  y={w.y}
                  width={winW}
                  height={winH}
                  rx={1.5}
                  className={windowClass}
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
