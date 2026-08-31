'use server';

import { revalidatePath } from 'next/cache';
import { adminPost } from '@/api/admin';
import { ApiError } from '@/api/envelope';
import { t } from '@/i18n/messages';

export interface DecideResult {
  ok: boolean;
  error?: string;
}

export async function decideVerificationAction(
  caseId: string,
  decision: 'APPROVED' | 'REJECTED',
  reason: string,
): Promise<DecideResult> {
  const trimmed = reason.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: t('verification.reasonRequired') };
  }

  try {
    await adminPost(
      `/admin/verification-cases/${caseId}/decide`,
      { decision, reason: trimmed },
      crypto.randomUUID(),
    );
    revalidatePath('/verification');
    revalidatePath('/');
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.problem.detail };
    }
    return { ok: false, error: t('states.network') };
  }
}
