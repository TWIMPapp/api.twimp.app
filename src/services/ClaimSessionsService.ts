import { supabaseAdmin } from '../config/supabase';
import { claimSessions as claimCore, ClaimResult } from './ClaimSessionsCore';

export type { ClaimResult };

export function claimSessions(email: string, anonId: string, opts: { dryRun?: boolean } = {}): Promise<ClaimResult> {
    return claimCore(email, anonId, { dryRun: opts.dryRun, db: supabaseAdmin });
}
