interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <img
      src="/logo-copper.webp"
      alt="Copper Logo"
      className={`h-9 w-auto object-contain ${className}`}
    />
  );
}
