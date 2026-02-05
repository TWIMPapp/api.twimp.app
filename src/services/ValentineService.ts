import { CustomTrailService } from './CustomTrailService';

const MAX_MESSAGE_LENGTH = 200;
const MAX_SENDS_PER_DAY = 5;

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Simple in-memory rate limiting (resets on deploy)
// For production, consider using Supabase or Redis
const sendCounts: Map<string, { count: number; date: string }> = new Map();

function getTodaySendCount(email: string): number {
    const today = new Date().toISOString().split('T')[0];
    const record = sendCounts.get(email.toLowerCase());
    if (!record || record.date !== today) {
        return 0;
    }
    return record.count;
}

function incrementSendCount(email: string): void {
    const today = new Date().toISOString().split('T')[0];
    const lowerEmail = email.toLowerCase();
    const record = sendCounts.get(lowerEmail);
    if (!record || record.date !== today) {
        sendCounts.set(lowerEmail, { count: 1, date: today });
    } else {
        record.count++;
    }
}

export class ValentineService {

    /**
     * Send a Secret Valentine
     * Creates a dynamic custom trail (pins generated when recipient opens it)
     */
    static async sendValentine(
        senderEmail: string,
        recipientEmail: string,
        message: string
    ): Promise<{ success: boolean; trailId?: string; message?: string }> {

        // Validate emails
        if (!isValidEmail(senderEmail)) {
            return { success: false, message: 'Invalid sender email' };
        }
        if (!isValidEmail(recipientEmail)) {
            return { success: false, message: 'Invalid recipient email' };
        }

        // Validate message
        if (!message || message.trim().length === 0) {
            return { success: false, message: 'Message is required' };
        }
        if (message.length > MAX_MESSAGE_LENGTH) {
            return { success: false, message: `Message must be ${MAX_MESSAGE_LENGTH} characters or less` };
        }

        // Rate limit check
        if (getTodaySendCount(senderEmail) >= MAX_SENDS_PER_DAY) {
            return { success: false, message: `You can only send ${MAX_SENDS_PER_DAY} valentines per day` };
        }

        // Create a dynamic trail - pins will be generated near the recipient when they open it
        const result = await CustomTrailService.createDynamicTrail(
            `valentine_${recipientEmail.toLowerCase()}`,
            'valentine',
            'Secret Valentine 💌',
            1, // Just 1 pin for secret valentine
            'heart_red',
            message.trim(),
            false // Not competitive
        );

        if (!result.ok || !result.trail) {
            return { success: false, message: result.message || 'Failed to create valentine' };
        }

        // Track rate limit
        incrementSendCount(senderEmail);

        // Send email to recipient
        await this.sendValentineEmail(recipientEmail, result.trail.id);

        return { success: true, trailId: result.trail.id };
    }

    /**
     * Send email to recipient with the trail link
     * TODO: Integrate with email provider (Resend, SendGrid, etc.)
     */
    private static async sendValentineEmail(recipientEmail: string, trailId: string): Promise<void> {
        const collectUrl = `https://game.twimp.app/custom-trail/${trailId}`;

        console.log('=== Valentine Email ===');
        console.log(`To: ${recipientEmail}`);
        console.log(`Subject: 💌 Someone sent you a Secret Valentine!`);
        console.log(`Collect URL: ${collectUrl}`);
        console.log('=======================');

        // TODO: Implement actual email sending with Resend/SendGrid
    }
}
