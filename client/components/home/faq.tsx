"use client";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  {
    question: "How do you make a tissue dance?",
    answer:
      "You put a little boogie on it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  {
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  {
    question: "How do you make a tissue dance?",
    answer:
      "You put a little boogie on it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
];

export default function FAQ() {
  return (
    <div className="bg-base-100">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-base-200">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold leading-10 tracking-tight text-base-content"
          >
            Frequently asked questions
          </motion.h2>
          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 space-y-6 divide-y divide-base-200"
          >
            {faqs.map((faq, index) => (
              <div key={faq.question + index} className="pt-6">
                <dt className="text-lg font-semibold leading-7 text-base-content">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-base leading-7 text-base-content/80">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </div>
  );
}
