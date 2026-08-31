'use server';

import { revalidatePath } from 'next/cache';
import { adminPut } from '@/api/admin';
import { ApiError } from '@/api/envelope';
import { t } from '@/i18n/messages';

export interface SaveBillingResult {
  ok: boolean;
  error?: string;
}

export async function saveModulePricesAction(input: {
  notice: string;
  modules: Array<{ code: string; monthlyPriceAmount: number; included: boolean }>;
}): Promise<SaveBillingResult> {
  try {
    await adminPut('/admin/module-prices', input);
    revalidatePath('/abonnements');
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.problem.detail };
    }
    return { ok: false, error: t('states.network') };
  }
}
