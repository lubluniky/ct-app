export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
      {/* Mesh Gradient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[120px] animate-blob animation-delay-4000" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80" />
    </div>
  );
};
