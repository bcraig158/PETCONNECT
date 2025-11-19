// src/components/public/ContactForm.tsx
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

type ContactForm = z.infer<typeof contactSchema>;

type Props = {
  pageId: string;
  pageSlug: string;
};

export default function ContactForm({ pageId, pageSlug }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setError(null);
    try {
      const res = await fetch('/api/page/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId,
          pageSlug,
          ...data,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const result = await res.json();
        setError(result.error || 'Failed to send message');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Get in Touch</h2>
      
      {submitted && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-800">
          Message sent successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register('name')}
            placeholder="Your Name"
            className="w-full rounded border p-3"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            className="w-full rounded border p-3"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <input
            {...register('phone')}
            type="tel"
            placeholder="Phone (optional)"
            className="w-full rounded border p-3"
          />
        </div>
        <div>
          <textarea
            {...register('message')}
            placeholder="Your Message"
            rows={4}
            className="w-full rounded border p-3"
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full rounded bg-black px-4 py-3 text-white hover:bg-neutral-800"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

