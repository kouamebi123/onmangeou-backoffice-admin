import messages from '@/i18n/fr-CI.json';

type Messages = typeof messages;

type Join<K, P> = K extends string ? (P extends string ? `${K}.${P}` : never) : never;

type Leaves<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? Join<Prefix extends '' ? K : `${Prefix}.${K}`, Leaves<T[K]>>
        : Prefix extends ''
          ? K
          : `${Prefix}.${K}`;
    }[keyof T & string]
  : never;

export type MessageKey = Leaves<Messages>;

function lookup(path: string): unknown {
  const parts = path.split('.');
  let current: unknown = messages;

  for (const part of parts) {
    if (typeof current !== 'object' || current === null || !(part in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

export function t(key: MessageKey): string {
  const value = lookup(key);
  return typeof value === 'string' ? value : key;
}

export function statusLabel(status: string): string {
  const value = lookup(`status.${status}`);
  return typeof value === 'string' ? value : status;
}
