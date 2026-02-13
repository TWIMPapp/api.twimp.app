import { Resend } from 'resend';
import { CustomTrailService } from './CustomTrailService';

const MAX_MESSAGE_LENGTH = 200;
const MAX_CREATES_PER_DAY = 10;
const MAX_EMAILS_PER_DAY = 5;

let _resend: Resend | null = null;
function getResend(): Resend {
    if (!_resend) {
        _resend = new Resend(process.env.RESEND_API_KEY);
    }
    return _resend;
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Simple in-memory rate limiting by IP (resets on deploy)
const createCounts: Map<string, { count: number; date: string }> = new Map();
const emailCounts: Map<string, { count: number; date: string }> = new Map();

function getTodayCount(map: Map<string, { count: number; date: string }>, key: string): number {
    const today = new Date().toISOString().split('T')[0];
    const record = map.get(key);
    if (!record || record.date !== today) {
        return 0;
    }
    return record.count;
}

function incrementCount(map: Map<string, { count: number; date: string }>, key: string): void {
    const today = new Date().toISOString().split('T')[0];
    const record = map.get(key);
    if (!record || record.date !== today) {
        map.set(key, { count: 1, date: today });
    } else {
        record.count++;
    }
}

export class ValentineService {

    /**
     * Create a Secret Valentine trail (no email sent)
     */
    static async createValentine(
        recipientName: string,
        message: string,
        clientIp: string
    ): Promise<{ success: boolean; trailId?: string; message?: string }> {

        // Validate recipient name
        if (!recipientName || recipientName.trim().length === 0) {
            return { success: false, message: 'Recipient name is required' };
        }

        // Validate message
        if (!message || message.trim().length === 0) {
            return { success: false, message: 'Message is required' };
        }
        if (message.length > MAX_MESSAGE_LENGTH) {
            return { success: false, message: `Message must be ${MAX_MESSAGE_LENGTH} characters or less` };
        }

        // Rate limit by IP
        if (getTodayCount(createCounts, clientIp) >= MAX_CREATES_PER_DAY) {
            return { success: false, message: `You can only create ${MAX_CREATES_PER_DAY} valentines per day` };
        }

        // Create a dynamic trail - pins will be generated near the recipient when they open it
        const creatorId = `valentine_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const result = await CustomTrailService.createDynamicTrail(
            creatorId,
            'valentine',
            `Secret Valentine for ${recipientName.trim()} 💌`,
            1, // Just 1 pin for secret valentine
            'heart_red',
            message.trim(),
            false // Not competitive
        );

        if (!result.ok || !result.trail) {
            return { success: false, message: result.message || 'Failed to create valentine' };
        }

        // Track rate limit
        incrementCount(createCounts, clientIp);

        return { success: true, trailId: result.trail.id };
    }

    /**
     * Send valentine email to recipient
     * TODO: Integrate with email provider (Resend, SendGrid, etc.)
     */
    static async sendValentineEmail(
        trailId: string,
        recipientEmail: string,
        clientIp: string
    ): Promise<{ success: boolean; message?: string }> {

        if (!trailId || trailId.trim().length === 0) {
            return { success: false, message: 'Trail ID is required' };
        }

        if (!isValidEmail(recipientEmail)) {
            return { success: false, message: 'Invalid email address' };
        }

        // Rate limit emails by IP
        if (getTodayCount(emailCounts, clientIp) >= MAX_EMAILS_PER_DAY) {
            return { success: false, message: `You can only send ${MAX_EMAILS_PER_DAY} emails per day` };
        }

        const collectUrl = `https://game.twimp.app/v/${trailId}`;

        try {
            const { error } = await getResend().emails.send({
                from: 'Twimp <hello@twimp.app>',
                to: recipientEmail,
                subject: 'Someone sent you a Secret Valentine! 💌',
                html: `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 16px;">💌</div>
                        <h1 style="color: #831843; font-size: 24px; font-weight: 700; margin-bottom: 8px;">
                            You have a Secret Valentine!
                        </h1>
                        <p style="color: #6B7280; font-size: 16px; line-height: 1.5; margin-bottom: 32px;">
                            Someone special wanted to surprise you with a little Valentine's magic. Your valentine is waiting nearby — take a short walk to find it and discover their message.
                        </p>
                        <a href="${collectUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #EC4899 0%, #DB2777 100%); color: white; text-decoration: none; border-radius: 16px; font-weight: 700; font-size: 16px;">
                            Collect Your Valentine
                        </a>
                        <p style="color: #9CA3AF; font-size: 13px; margin-top: 32px; line-height: 1.4;">
                            Happy Valentine's Day!
                        </p>
                        <hr style="border: none; border-top: 1px solid #F3F4F6; margin: 24px 0;" />
                        <p style="color: #D1D5DB; font-size: 12px;">
                            <span style="color: #EC4899; font-weight: 600;">twimp</span> — outdoor adventures that bring stories to life
                        </p>
                    </div>
                `
            });

            if (error) {
                console.error('Resend error:', error);
                return { success: false, message: 'Failed to send email. Please try again.' };
            }
        } catch (e: any) {
            console.error('Email send error:', e);
            return { success: false, message: 'Failed to send email. Please try again.' };
        }

        incrementCount(emailCounts, clientIp);

        return { success: true };
    }
}
