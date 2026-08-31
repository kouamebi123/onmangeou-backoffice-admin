const STORAGE_KEY = 'omo_install_id';

export function getOrCreateInstallId(): string {
  if (typeof window === 'undefined') {
    return crypto.randomUUID();
  }

  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing && existing.length > 0) {
    return existing;
  }

  const created = crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEY, created);
  return created;
}
