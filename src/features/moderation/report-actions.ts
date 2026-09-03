'use server';
import { revalidatePath } from 'next/cache';
import { adminPost } from '@/api/admin';
import { ApiError } from '@/api/envelope';
import { t } from '@/i18n/messages';
export async function resolveReviewReport(
  id: string,
  status: 'DISMISSED' | 'ACTIONED',
  resolution: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminPost(`/admin/review-reports/${encodeURIComponent(id)}/resolve`, {
      status,
      resolution,
    });
    revalidatePath('/avis');
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof ApiError ? error.problem.detail : t('moderation.error'),
    };
  }
}
