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

  for (let index = 0; index < parts.length; index += 1) {
    if (typeof current !== 'object' || current === null) {
      return undefined;
    }

    const record = current as Record<string, unknown>;
    const remaining = parts.slice(index).join('.');
    if (remaining in record) {
      return record[remaining];
    }

    const part = parts[index];
    if (part === undefined || !(part in record)) {
      return undefined;
    }
    current = record[part];
  }

  return current;
}

export function t(key: MessageKey): string {
  const value = lookup(key);
  return typeof value === 'string' ? value : key;
}

export function codeLabel(namespace: 'audit.actions' | 'modules', code: string): string {
  const value = lookup(`${namespace}.${code}`);
  if (typeof value === 'string') {
    return value;
  }

  const words = code.replace(/[._-]+/g, ' ').trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : code;
}

export function statusLabel(status: string): string {
  const value = lookup(`status.${status}`);
  return typeof value === 'string' ? value : status;
}
