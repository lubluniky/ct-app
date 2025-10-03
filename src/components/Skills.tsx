import { CornerBrackets } from "./CornerBrackets";

const skills = {
  FRONTEND: ["React", "TypeScript", "Next.js", "Tailwind", "Three.js"],
  BACKEND: ["Node.js", "Python", "PostgreSQL", "Redis", "Docker"],
  BLOCKCHAIN: ["Solidity", "Ethers.js", "Web3.js", "Smart Contracts"],
  SECURITY: ["Penetration Testing", "OWASP", "Cryptography", "Network Security"],
};

export const Skills = () => {
  return (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 font-mono">
          <span className="text-secondary">{'> '}</span>TECH_STACK
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(skills).map(([category, items], idx) => (
            <CornerBrackets key={category} className="p-6 bg-card border border-border">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-primary pb-2">
                  <h3 className="text-xl font-bold text-primary font-mono">{category}</h3>
                  <span className="text-secondary text-sm">LEVEL_{idx + 1}</span>
                </div>
                
                <div className="space-y-2">
                  {items.map((skill, index) => (
                    <div key={skill} className="flex items-center space-x-3">
                      <span className="text-secondary">{'>'}</span>
                      <span className="text-muted-foreground font-mono">{skill}</span>
                      <div className="flex-1 flex space-x-1 ml-auto">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-8 ${
                              i <= index ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CornerBrackets>
          ))}
        </div>
      </div>
    </section>
  );
};
