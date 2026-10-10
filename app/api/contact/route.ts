import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address'),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(3000),
  // Anti-spam honeypot: bots fill these hidden fields; humans leave them empty
  honeypot: z.string().optional(),
  _website: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    // Silent rejection for bots: return 200 without executing dispatch
    if (
      (validated.honeypot && validated.honeypot.trim().length > 0) ||
      (validated._website && validated._website.trim().length > 0)
    ) {
      return NextResponse.json(
        { success: true, message: 'Message received.' },
        { status: 200 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipientEmail = process.env.CONTACT_EMAIL || 'pradyumna05@outlook.in';

    if (!apiKey) {
      // Honest error state: never pretend a message was sent when delivery cannot execute
      return NextResponse.json(
        {
          success: false,
          message:
            'Contact service requires an active RESEND_API_KEY environment variable. Please email pradyumna05@outlook.in directly.',
        },
        { status: 503 }
      );
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from: 'Portfolio Inquiry <onboarding@resend.dev>',
      to: recipientEmail,
      replyTo: validated.email,
      subject: validated.subject || `Inquiry from ${validated.name}`,
      text: `Name: ${validated.name}\nEmail: ${validated.email}\n\nMessage:\n${validated.message}`,
    });

    if (result.error) {
      return NextResponse.json(
        { success: false, message: result.error.message },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Message delivered successfully.' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0]?.message || 'Validation failed';
      return NextResponse.json(
        { success: false, message: firstIssue },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Unable to process contact request. Please try again.' },
      { status: 500 }
    );
  }
}
