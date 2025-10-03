import { useState } from "react";
import { CornerBrackets } from "./CornerBrackets";

export const Contact = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "SECURE CONNECTION ESTABLISHED",
    "TYPE 'HELP' FOR AVAILABLE COMMANDS",
  ]);

  const handleCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    let response = "";

    switch (command) {
      case "help":
        response = "AVAILABLE COMMANDS: EMAIL, TELEGRAM, GITHUB, LINKEDIN, CLEAR";
        break;
      case "email":
        response = "EMAIL: contact@borkiss.trade";
        break;
      case "telegram":
        response = "TELEGRAM: @borkiss";
        break;
      case "github":
        response = "GITHUB: github.com/borkiss";
        break;
      case "linkedin":
        response = "LINKEDIN: linkedin.com/in/borkiss";
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      default:
        response = `COMMAND NOT FOUND: ${cmd}. TYPE 'HELP' FOR AVAILABLE COMMANDS`;
    }

    setHistory([...history, `> ${cmd}`, response]);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
    }
  };

  return (
    <section className="min-h-screen py-20 px-4 flex items-center">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 font-mono">
          <span className="text-secondary">{'> '}</span>ESTABLISH_CONTACT
        </h2>
        
        <CornerBrackets className="p-6 bg-card border border-primary/50">
          <div className="space-y-4">
            <div className="h-96 overflow-y-auto space-y-2 font-mono text-sm scrollbar-thin scrollbar-thumb-primary">
              {history.map((line, index) => (
                <div
                  key={index}
                  className={line.startsWith(">") ? "text-primary" : "text-muted-foreground"}
                >
                  {line}
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="text-secondary">{'>'}</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-primary font-mono"
                placeholder="TYPE COMMAND..."
                autoFocus
              />
              <div className="animate-pulse text-primary">|</div>
            </form>
          </div>
        </CornerBrackets>
        
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleCommand("email")}
            className="p-3 border border-primary/30 hover:border-primary hover:bg-primary/10 transition-all text-primary font-mono text-sm"
          >
            EMAIL
          </button>
          <button
            onClick={() => handleCommand("telegram")}
            className="p-3 border border-primary/30 hover:border-primary hover:bg-primary/10 transition-all text-primary font-mono text-sm"
          >
            TELEGRAM
          </button>
          <button
            onClick={() => handleCommand("github")}
            className="p-3 border border-primary/30 hover:border-primary hover:bg-primary/10 transition-all text-primary font-mono text-sm"
          >
            GITHUB
          </button>
          <button
            onClick={() => handleCommand("linkedin")}
            className="p-3 border border-primary/30 hover:border-primary hover:bg-primary/10 transition-all text-primary font-mono text-sm"
          >
            LINKEDIN
          </button>
        </div>
      </div>
    </section>
  );
};
