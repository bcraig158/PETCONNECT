// src/app/contact/page.tsx
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required'),
});

type Form = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(data: Form) {
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const result = await res.json();
        setError(result.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  }

  return (
    <section className="max-w-xl">
      <h1 className="mb-4 text-2xl font-semibold">Contact us</h1>
      <p className="text-neutral-600 mb-6">
        Have a question or feedback? We'd love to hear from you!
      </p>
      
      {submitted && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-800">
          Message sent successfully! We'll get back to you soon.
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            {...register('name')}
            placeholder="Your name"
            className="rounded border p-2 w-full"
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            {...register('email')}
            placeholder="Email"
            type="email"
            className="rounded border p-2 w-full"
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            {...register('message')}
            placeholder="Your message"
            rows={6}
            className="rounded border p-2 w-full"
            disabled={isSubmitting}
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
        </div>
        <button 
          type="submit" 
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </section>
  );
}

