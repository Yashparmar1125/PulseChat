import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";
import PulseIndicator from "./PulseIndicator";

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isUser: boolean;
  read?: boolean;
}

export default function PulseChatMockup() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Alex",
      text: "Just joined! Excited to be here 🎉",
      time: "2:34 PM",
      isUser: false,
    },
    {
      id: 2,
      sender: "You",
      text: "Welcome! 👋 Great to have you",
      time: "2:35 PM",
      isUser: true,
      read: true,
    },
    {
      id: 3,
      sender: "Jordan",
      text: "The performance is incredible 🚀",
      time: "2:36 PM",
      isUser: false,
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [showReadIndicator, setShowReadIndicator] = useState(false);

  useEffect(() => {
    // Simulate real-time message flow with continuous loop
    const sequence = [
      () => {
        // Show read indicator
        setShowReadIndicator(true);
        setTimeout(() => setShowReadIndicator(false), 800);
      },
      () => {
        // Update message to read
        setMessages(prev => prev.map(msg => 
          msg.id === 2 ? { ...msg, read: true } : msg
        ));
      },
      () => {
        // Show typing indicator
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 1500);
      },
    ];

    let currentStep = 0;
    const timers: NodeJS.Timeout[] = [];

    const runSequence = () => {
      const action = sequence[currentStep % sequence.length];
      action();
      
      const delays = [1000, 500, 2000];
      const delay = delays[currentStep % delays.length];
      
      const timer = setTimeout(() => {
        currentStep++;
        runSequence();
      }, delay);
      
      timers.push(timer);
    };

    // Start after initial delay
    const initialTimer = setTimeout(() => {
      runSequence();
    }, 2000);

    return () => {
      clearTimeout(initialTimer);
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <div className="relative h-[500px] sm:h-[550px] lg:h-[600px] w-full max-w-md mx-auto" role="img" aria-label="PULSE chat interface preview">
      {/* Depth of field blur background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pulse-cyan/10 via-pulse-grey-light to-white dark:from-pulse-cyan/20 dark:via-pulse-grey-light dark:to-pulse-white rounded-3xl blur-3xl opacity-50 dark:opacity-30 -z-10 animate-pulse-slow"></div>
      <motion.div 
        className="absolute inset-0 bg-white dark:bg-pulse-white rounded-2xl shadow-2xl dark:shadow-2xl overflow-hidden border border-pulse-grey-subtle dark:border-pulse-grey-subtle backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Chat Header */}
        <div className="bg-white dark:bg-pulse-white border-b border-pulse-grey-subtle dark:border-pulse-grey-subtle px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-pulse-cyan flex items-center justify-center shadow-md">
                <span className="font-bold text-white text-sm">P</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-pulse-white"></div>
            </div>
            <div>
              <p className="font-semibold text-pulse-black dark:text-pulse-black text-sm">Sarah</p>
              <p className="text-xs text-pulse-grey-text dark:text-pulse-grey-text">Online</p>
            </div>
          </div>
          {/* Security Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-pulse-cyan/10 dark:bg-pulse-cyan/20 rounded-lg border border-pulse-cyan/20 dark:border-pulse-cyan/30">
            <svg className="w-4 h-4 text-pulse-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-xs font-semibold text-pulse-cyan">Encrypted</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-pulse-grey-light dark:bg-pulse-grey-light h-[calc(100%-140px)]">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex gap-3 ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-pulse-grey-subtle dark:bg-pulse-grey-subtle flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-pulse-black dark:text-pulse-black">
                      {message.sender[0]}
                    </span>
                  </div>
                )}
                <div className={`space-y-1 max-w-xs ${message.isUser ? "items-end" : "items-start"} flex flex-col`}>
                  {!message.isUser && (
                    <p className="text-xs font-semibold text-pulse-black dark:text-pulse-black px-1">
                      {message.sender}
                    </p>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2.5 ${
                      message.isUser
                        ? "bg-pulse-cyan text-white shadow-md"
                        : "bg-white dark:bg-pulse-white text-pulse-black dark:text-pulse-black border border-pulse-grey-subtle dark:border-pulse-grey-subtle shadow-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span
                        className={`text-[10px] ${
                          message.isUser ? "text-white/70" : "text-pulse-grey-text dark:text-pulse-grey-text"
                        }`}
                      >
                        {message.time}
                      </span>
                      {message.isUser && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                        >
                          {message.read ? (
                            <CheckCheck className="w-3 h-3 text-white/70" />
                          ) : (
                            <Check className="w-3 h-3 text-white/70" />
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
                {message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-pulse-cyan/20 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-pulse-cyan">Y</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 items-center"
            >
              <div className="w-8 h-8 rounded-full bg-pulse-grey-subtle flex-shrink-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-pulse-black">S</span>
              </div>
              <div className="bg-white rounded-lg px-4 py-2.5 border border-pulse-grey-subtle">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-pulse-grey-text rounded-full animate-bounce"></div>
                  <div
                    className="w-1.5 h-1.5 bg-pulse-grey-text rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-pulse-grey-text rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Read Indicator Animation */}
          {showReadIndicator && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-end pr-2"
            >
              <div className="flex items-center gap-1 text-[10px] text-pulse-grey-text">
                <CheckCheck className="w-3 h-3 text-pulse-cyan" />
                <span>Read</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-pulse-grey-subtle dark:border-pulse-grey-subtle bg-white dark:bg-pulse-white p-4">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-pulse-grey-subtle dark:border-pulse-grey-subtle px-4 py-2.5 text-sm text-pulse-black dark:text-pulse-black placeholder:text-pulse-grey-text dark:placeholder:text-pulse-grey-text bg-white dark:bg-pulse-white focus:outline-none focus:ring-2 focus:ring-pulse-cyan focus:border-transparent"
              disabled
            />
            <button className="w-10 h-10 rounded-lg bg-pulse-cyan text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-md">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

