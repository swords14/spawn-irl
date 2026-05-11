import { motion } from 'framer-motion';

export function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="relative w-24 h-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-t-neon-blue border-r-transparent border-b-transparent border-l-transparent rounded-full shadow-[0_0_15px_#0ff]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-4 bg-neon-blue/20 rounded-full flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-neon-blue rounded-full animate-ping" />
        </motion.div>
      </div>
      <div className="text-center">
        <p className="text-neon-blue font-mono text-xl font-black uppercase">{message}</p>
      </div>
    </div>
  );
}