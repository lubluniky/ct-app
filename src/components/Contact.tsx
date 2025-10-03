const contacts = [
  { 
    label: "Ready to level up your trading?", 
    value: "cryptomannn.com", 
    link: "https://cryptomannn.com" 
  },
  { 
    label: "Telegram", 
    value: "@borkiss", 
    link: "https://t.me/borkiss" 
  },
  { 
    label: "Email", 
    value: "contact@borkiss.trade", 
    link: "mailto:contact@borkiss.trade" 
  },
];

export const Contact = () => {
  return (
    <section className="py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-6 mb-6">
            <span className="text-6xl font-bold text-primary/20">05</span>
            <h2 className="text-4xl md:text-5xl font-bold">Connect</h2>
          </div>
          <div className="w-20 h-1 bg-primary" />
        </div>
        
        <div className="space-y-6">
          {contacts.map((contact, idx) => (
            <a
              key={idx}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-border bg-card p-8 hover-lift group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">{contact.label}</div>
                  <div className="text-xl font-medium group-hover:text-primary transition-colors">
                    {contact.value}
                  </div>
                </div>
                <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                  <span className="text-xl">→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
