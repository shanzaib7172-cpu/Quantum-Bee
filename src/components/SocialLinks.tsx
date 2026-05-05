import { Github, Twitter, Linkedin, Instagram, Youtube, Send } from "lucide-react";

const socials = [
  { icon: Twitter, label: "X / Twitter", href: "https://x.com/quantumbee", color: "hsl(200,100%,70%)" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/quantum-bee", color: "hsl(210,100%,60%)" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/quantumbee", color: "hsl(320,80%,65%)" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@quantumbee", color: "hsl(0,80%,60%)" },
  { icon: Github, label: "GitHub", href: "https://github.com/quantumbee", color: "hsl(220,15%,80%)" },
  { icon: Send, label: "Telegram", href: "https://t.me/quantumbee", color: "hsl(195,90%,60%)" },
];

interface Props {
  variant?: "row" | "grid";
  className?: string;
}

const SocialLinks = ({ variant = "row", className = "" }: Props) => {
  return (
    <div
      className={`${
        variant === "grid"
          ? "grid grid-cols-3 sm:grid-cols-6 gap-3"
          : "flex flex-wrap items-center justify-center gap-3"
      } ${className}`}
    >
      {socials.map(({ icon: Icon, label, href, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="group relative w-12 h-12 rounded-xl flex items-center justify-center bg-[hsl(220,40%,8%)]/70 border border-[hsl(200,100%,60%)]/20 hover:border-[hsl(40,100%,55%)]/60 transition-all backdrop-blur-md hover:-translate-y-0.5"
        >
          <span
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
            style={{ background: color, opacity: 0.0 }}
          />
          <Icon
            className="w-5 h-5 transition-transform group-hover:scale-110"
            style={{ color }}
          />
          <span className="sr-only">{label}</span>
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
