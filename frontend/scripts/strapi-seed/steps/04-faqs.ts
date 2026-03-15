/**
 * Seed FAQs.
 */

import { loadJson } from '../lib/load-json';
import { createEntry } from '../lib/client';

interface FaqJson {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export async function seedFaqs(): Promise<void> {
  const faqs = await loadJson<FaqJson[]>('faqs.json');
  for (const faq of faqs) {
    await createEntry('faqs', {
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      featured: false,
    });
    console.log(`  Created FAQ: ${faq.question.slice(0, 50)}...`);
  }
}
