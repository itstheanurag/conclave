"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    id: "01",
    question: "How does the pricing model work for the API?",
    answer:
      "We offer a generous free tier for development (up to 1,000 participant minutes/mo). For production, we use a pay-as-you-go model starting at $0.004 per minute. Volume discounts are available for enterprise teams.",
  },
  {
    id: "02",
    question: "Is the video stream end-to-end encrypted?",
    answer:
      "Yes. Security is our priority. All video and audio streams are encrypted using AES-256. We support HIPAA and GDPR compliance out of the box, and we never store raw video data on our servers.",
  },
  {
    id: "03",
    question: "Can I host this on my own infrastructure?",
    answer:
      "We offer an On-Premise Enterprise plan that allows you to deploy our media servers within your own VPC (AWS, GCP, or Azure) for complete control over data residency and network topology.",
  },
  {
    id: "04",
    question: "What is the maximum number of participants?",
    answer:
      "Our standard rooms support up to 50 active webcams with 1000+ passive viewers. For large-scale events, our 'Town Hall' mode supports up to 100,000 viewers with sub-second latency.",
  },
  {
    id: "05",
    question: "Do you support React Native and Flutter?",
    answer:
      "Absolutely. We provide native SDKs for iOS, Android, React Native, and Flutter. The API is consistent across all platforms, sharing the same core logic and state management patterns.",
  },
];

const FAQItem = ({
  faq,
  isOpen,
  onClick,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="relative group">
      {/* The Timeline Line (Right Side) */}
      <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-base-content/10">
        {/* The Active Glow Line */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: isOpen ? "100%" : "0%" }}
          className="absolute top-0 right-0 w-[2px] bg-primary shadow-[0_0_15px_rgba(var(--p),0.6)]"
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* The Timeline Node (Dot) */}
      <motion.div
        animate={{
          backgroundColor: isOpen ? "hsl(var(--p))" : "hsl(var(--b3))",
          scale: isOpen ? 1.2 : 1,
        }}
        className="absolute top-8 -right-[4.5px] w-2.5 h-2.5 rounded-full border border-base-100 z-10 transition-colors duration-300"
      />

      {/* The Card Content */}
      <div className={`relative pr-12 pb-4 ${isOpen ? "mb-6" : "mb-2"}`}>
        <button
          onClick={onClick}
          className={`w-full text-left p-6 rounded-2xl transition-all duration-300 border ${
            isOpen
              ? "bg-base-200 border-primary/20 shadow-lg"
              : "bg-base-100 border-base-content/5 hover:bg-base-200/50 hover:border-base-content/10"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span
                className={`text-sm font-mono transition-colors ${
                  isOpen ? "text-primary" : "text-base-content/40"
                }`}
              >
                {faq.id}
              </span>
              <h3
                className={`font-bold text-lg transition-colors ${
                  isOpen ? "text-base-content" : "text-base-content/80"
                }`}
              >
                {faq.question}
              </h3>
            </div>

            {/* Animated Chevron */}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              className={`shrink-0 ${
                isOpen ? "text-primary" : "text-base-content/40"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="pt-4 text-base-content/70 leading-relaxed pl-10">
                  {faq.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 sm:py-32 bg-base-100 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-base-content sm:text-4xl"
          >
            Common Queries
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            className="h-1 bg-primary mt-4 rounded"
          />
        </div>

        {/* The Timeline FAQ List */}
        <div className="relative">
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(index === openIndex ? null : index)}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 pt-8 border-t border-base-content/10 flex justify-between items-center">
          <p className="text-base-content/60">Still have questions?</p>
          <a
            href="/contact"
            className="text-primary font-bold hover:underline flex items-center gap-2"
          >
            Contact Support
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
