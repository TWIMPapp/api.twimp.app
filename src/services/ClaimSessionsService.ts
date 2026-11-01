import { supabaseAdmin } from '../config/supabase';
import { claimSessions as claimCore, ClaimResult } from './ClaimSessionsCore';

export type { ClaimResult };

export function claimSessions(email: string, anonId: string, opts: { dryRun?: boolean; marketingConsentAt?: string | null } = {}): Promise<ClaimResult> {
    return claimCore(email, anonId, { dryRun: opts.dryRun, marketingConsentAt: opts.marketingConsentAt, db: supabaseAdmin });
}
