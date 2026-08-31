'use server';

import { revalidatePath } from 'next/cache';
import { adminPost } from '@/api/admin';
import { ApiError } from '@/api/envelope';

export async function hideReviewAction(reviewId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminPost(`/admin/reviews/${reviewId}/hide`, {});
    revalidatePath('/avis');
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.problem.detail };
    }
    return { ok: false, error: 'Impossible de masquer cet avis.' };
  }
}

export async function refundOrderAction(orderId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminPost(`/admin/orders/${orderId}/refund`, {});
    revalidatePath('/commandes');
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.problem.detail };
    }
    return { ok: false, error: 'Impossible de rembourser cette commande.' };
  }
}

export async function closeTicketAction(
  ticketId: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminPost(`/admin/support-tickets/${ticketId}/close`, {});
    revalidatePath('/support');
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.problem.detail };
    }
    return { ok: false, error: 'Impossible de clore ce ticket.' };
  }
}
