import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQPageProps {
  onBack: () => void;
}

const faqs = [
  {
    category: "SHIPPING_LOGISTICS",
    questions: [
      {
        q: "Where do you ship from?",
        a: "All orders are dispatched directly from our facility in Florida, USA. We process orders within 24-48 hours of receipt, excluding weekends and major holidays."
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship globally. International shipping rates are calculated at checkout based on destination and weight. Please note that international customers are responsible for any customs duties, VAT, or import taxes incurred upon delivery."
      },
      {
        q: "How is the rod packaged for transit?",
        a: "We utilize a custom-engineered, high-density cardboard tube with reinforced end caps. Each rod section is individually wrapped in a protective sleeve to prevent abrasion during transport."
      }
    ]
  },
  {
    category: "WARRANTY_Protocol",
    questions: [
      {
        q: "What is the replacement program?",
        a: "We understand the harsh environments our gear operates in. If you break a rod section—whether by car door or big fish—we offer a replacement section program. You don't need to buy a whole new rod; simply contact support to order the specific section you need."
      },
      {
        q: "What is the return policy?",
        a: "We accept returns on unused, unaltered merchandise in original packaging within 30 days of delivery. Return shipping costs are the responsibility of the customer unless the item is defective or incorrect."
      }
    ]
  },
  {
    category: "TECHNICAL_SPECS",
    questions: [
      {
        q: "Will this fit in my carry-on luggage?",
        a: "Yes. The 9'2\" Travel Series breaks down into 5 equal sections, with a collapsed length of approximately 24 inches. It is designed to fit diagonally in most standard carry-on suitcases and backpacks."
      },
      {
        q: "What reel size pairs best with the 9'2\" rod?",
        a: "We recommend a 4000 to 5000 size spinning reel. This balances the rod perfectly for both surf casting and inshore lure work."
      },
      {
        q: "What is the lure weight rating?",
        a: "The rod is rated for 1-3 oz (approx. 28-85g). It has a sweet spot around 1.5-2 oz for maximum casting distance but retains enough sensitivity for lighter payloads."
      }
    ]
  }
];

const FAQPage: React.FC<FAQPageProps> = ({ onBack }) => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-16">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono uppercase text-neutral-500 hover:text-black mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Base
          </button>
          
          <div className="flex items-start justify-between border-b border-black pb-8">
            <div>
                <span className="font-mono text-xs uppercase text-neutral-500 block mb-2">/// KNOWLEDGE_BASE</span>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">FAQ</h1>
            </div>
            <HelpCircle className="w-12 h-12 stroke-1 text-black hidden md:block" />
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-16">
          {faqs.map((section, sIndex) => (
            <div key={sIndex}>
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest bg-black text-white inline-block px-2 py-1 mb-6">
                {section.category}
              </h3>
              
              <div className="border-t border-black/10">
                {section.questions.map((item, qIndex) => {
                  const id = `${sIndex}-${qIndex}`;
                  const isOpen = openIndex === id;
                  
                  return (
                    <div key={qIndex} className="border-b border-black/10">
                      <button 
                        onClick={() => toggleAccordion(id)}
                        className="w-full py-6 flex justify-between items-start text-left group hover:bg-neutral-50 transition-colors px-2"
                      >
                        <span className={`text-lg font-bold uppercase pr-8 ${isOpen ? 'text-black' : 'text-neutral-800'}`}>
                          {item.q}
                        </span>
                        <span className="flex-shrink-0 mt-1">
                          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </span>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pb-8 pt-2 px-2 max-w-2xl">
                              <p className="font-mono text-xs md:text-sm text-neutral-600 leading-relaxed uppercase">
                                {item.a}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-neutral-50 border border-black p-8 md:p-12 text-center">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Still have questions?</h3>
            <p className="font-mono text-xs text-neutral-500 uppercase mb-8">
                Our team is standing by to assist with technical inquiries.
            </p>
            <a href="mailto:info@heyskipperfishing.com" className="inline-block bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors">
                Contact Support
            </a>
        </div>

      </div>
    </div>
  );
};

export default FAQPage;