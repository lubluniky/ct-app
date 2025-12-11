import { Mail, MessageSquare, Globe, ArrowUpRight } from "lucide-react";

const contacts = [
  { 
    label: "Ready to level up your trading?", 
    value: "cryptomannn.com", 
    link: "https://cryptomannn.com",
    icon: Globe,
    color: "text-blue-400",
    border: "group-hover:border-blue-500/30",
    bg: "group-hover:bg-blue-500/5"
  },
  { 
    label: "Telegram", 
    value: "@borkiss", 
    link: "https://t.me/borkiss",
    icon: MessageSquare,
    color: "text-emerald-400",
    border: "group-hover:border-emerald-500/30",
    bg: "group-hover:bg-emerald-500/5"
  },
  { 
    label: "Email", 
    value: "contact@borkiss.trade", 
    link: "mailto:contact@borkiss.trade",
    icon: Mail,
    color: "text-purple-400",
    border: "group-hover:border-purple-500/30",
    bg: "group-hover:bg-purple-500/5"
  },
];

export const Contact = () => {
  return (
    <section className="py-24 relative" id="connect">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-white">
              Connect
            </h2>
            <p className="text-slate-400 text-lg max-w-xl">
              For research questions, collaborations, or consulting inquiries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contacts.map((contact, idx) => (
            <a
              key={idx}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                group relative glass-card p-8 rounded-2xl transition-all duration-300
                hover:-translate-y-1 ${contact.border} ${contact.bg}
              `}
            >
              <div className="flex items-center justify-between mb-8">
                <div className={`p-3 rounded-xl bg-white/5 ${contact.color}`}>
                  <contact.icon className="w-6 h-6" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              
              <div className="mt-auto">
                <div className="text-sm text-slate-500 mb-2 font-medium">{contact.label}</div>
                <div className="text-lg font-bold text-white group-hover:text-glow transition-all">
                  {contact.value}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
