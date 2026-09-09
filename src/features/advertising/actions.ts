'use server';
import { revalidatePath } from 'next/cache';
import { adminPost } from '@/api/admin';
import { ApiError } from '@/api/envelope';
import { t } from '@/i18n/messages';
export async function decideCampaign(id: string, status: string, reason: string) {
  try {
    await adminPost(`/admin/ad-campaigns/${encodeURIComponent(id)}/decision`, { status, reason });
    revalidatePath('/publicite');
    return { ok: true, message: t('moderation.success') };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof ApiError ? error.problem.detail : t('moderation.error'),
    };
  }
}
