'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ContactForm({ contactEmail }: { contactEmail?: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    // Placeholder: wire to API later
    await new Promise((r) => setTimeout(r, 800));
    setStatus('sent');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium mb-2">
          Name
        </label>
        <Input id="contact-name" name="name" required placeholder="Your name" />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <Input id="contact-email" name="email" type="email" required placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium mb-2">
          Subject
        </label>
        <Input id="contact-subject" name="subject" placeholder="What is this about?" />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Your message..."
          className="resize-none"
        />
      </div>
      {status === 'sent' && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Thanks! Your message has been sent. I&apos;ll get back to you soon.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-destructive">
          Something went wrong. Please try again or email {contactEmail ?? 'hello@zdrav.life'} directly.
        </p>
      )}
      <Button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send message'}
      </Button>
    </form>
  );
}
