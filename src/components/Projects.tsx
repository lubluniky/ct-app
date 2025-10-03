import { CornerBrackets } from "./CornerBrackets";

const projects = [
  {
    id: "PRJ_001",
    name: "DEFI TRADING PLATFORM",
    description: "Automated trading system with real-time analytics and smart contract integration",
    status: "OPERATIONAL",
    tech: ["React", "Web3.js", "Node.js"],
    risk: "HIGH",
  },
  {
    id: "PRJ_002",
    name: "SECURITY AUDIT TOOL",
    description: "Comprehensive vulnerability scanner for web applications and smart contracts",
    status: "OPERATIONAL",
    tech: ["Python", "Solidity", "Docker"],
    risk: "MEDIUM",
  },
  {
    id: "PRJ_003",
    name: "ENCRYPTED MESSAGING",
    description: "End-to-end encrypted communication platform with blockchain verification",
    status: "DEVELOPMENT",
    tech: ["Next.js", "WebRTC", "IPFS"],
    risk: "LOW",
  },
  {
    id: "PRJ_004",
    name: "NFT MARKETPLACE",
    description: "Decentralized marketplace for digital assets with custom royalty system",
    status: "OPERATIONAL",
    tech: ["TypeScript", "Ethers.js", "PostgreSQL"],
    risk: "MEDIUM",
  },
];

export const Projects = () => {
  return (
    <section className="min-h-screen py-20 px-4 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 font-mono">
          <span className="text-secondary">{'> '}</span>PROJECT_ARCHIVE
        </h2>
        
        <div className="space-y-6">
          {projects.map((project) => (
            <CornerBrackets
              key={project.id}
              className="p-6 bg-background border border-border hover:border-primary transition-all duration-300 cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-secondary text-sm font-mono">{project.id}</span>
                      <h3 className="text-xl font-bold text-primary group-hover:text-matrix transition-colors">
                        {project.name}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm">{project.description}</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">STATUS</div>
                      <div className={`text-sm font-mono ${
                        project.status === 'OPERATIONAL' ? 'text-primary' : 'text-secondary'
                      }`}>
                        {project.status}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">RISK</div>
                      <div className={`text-sm font-mono ${
                        project.risk === 'HIGH' ? 'text-secondary' : 
                        project.risk === 'MEDIUM' ? 'text-orange' : 'text-primary'
                      }`}>
                        {project.risk}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs border border-primary/30 text-primary font-mono"
                    >
                      {tech}
                    </span>
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
