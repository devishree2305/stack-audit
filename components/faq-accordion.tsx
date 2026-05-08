"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { faqs } from "@/lib/pricing-data";

export function FAQAccordion() {
  const [openItem, setOpenItem] = useState(0);

  return (
    <div className="grid gap-4">
      {faqs.map((item, index) => {
        const isOpen = openItem === index;

        return (
          <div
            key={item.question}
            className="surface overflow-hidden rounded-3xl"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              onClick={() => setOpenItem(isOpen ? -1 : index)}
            >
              <span className="text-base font-medium text-white">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 flex-none text-slate-400 transition ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <motion.div
              initial={false}
              animate={{
                height: isOpen ? "auto" : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-6 text-sm leading-7 text-slate-300">
                {item.answer}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
