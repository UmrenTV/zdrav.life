'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ContactForm({ contactEmail }: { contactEmail?: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const fd = new FormData(e.currentTarget);
    const name = (fd.get('name') as string)?.trim();
    const email = (fd.get('email') as string)?.trim();
    const subject = (fd.get('subject') as string)?.trim() || undefined;
    const message = (fd.get('message') as string)?.trim();

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('sent');
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-xl bg-muted/30">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <Check className="h-7 w-7 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="font-heading font-semibold text-xl mb-2">Message sent!</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Thanks for reaching out. I&apos;ll get back to you within 48 hours.
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4"
          onClick={() => setStatus('idle')}
        >
          Send another message
        </Button>
      </div>
    );
  }

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
      {status === 'error' && (
        <p className="text-sm text-destructive">
          {errorMsg || `Something went wrong. Please try again or email ${contactEmail ?? 'hello@zdrav.life'} directly.`}
        </p>
      )}
      <Button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
        ) : (
          'Send message'
        )}
      </Button>
    </form>
  );
}
