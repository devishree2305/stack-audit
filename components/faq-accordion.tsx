"use client";

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
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${index}`}
              id={`faq-trigger-${index}`}
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
            <div
              id={`faq-panel-${index}`}
              role="region"
              aria-labelledby={`faq-trigger-${index}`}
              className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0">
                <p className="px-6 pb-6 text-sm leading-7 text-slate-300">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
