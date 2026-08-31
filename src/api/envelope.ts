export interface ResponseEnvelope<T> {
  data: T;
  meta: {
    requestId: string;
    nextCursor: string | null;
  };
}

export interface ProblemFieldError {
  field: string;
  code: string;
  message: string;
}

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  code: string;
  detail: string;
  requestId: string;
  fields: ProblemFieldError[];
}

export class ApiError extends Error {
  readonly problem: ProblemDetails;

  constructor(problem: ProblemDetails) {
    super(problem.detail);
    this.name = 'ApiError';
    this.problem = problem;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isEnvelope(value: unknown): value is ResponseEnvelope<unknown> {
  return (
    isRecord(value) &&
    'data' in value &&
    isRecord(value['meta']) &&
    typeof value['meta']['requestId'] === 'string'
  );
}

export function unwrapEnvelope<T>(body: unknown): ResponseEnvelope<T> {
  if (!isEnvelope(body)) {
    throw new Error('Reponse API hors enveloppe { data, meta }.');
  }

  return body as ResponseEnvelope<T>;
}

export function isProblemDetails(value: unknown): value is ProblemDetails {
  return (
    isRecord(value) &&
    typeof value['type'] === 'string' &&
    typeof value['title'] === 'string' &&
    typeof value['status'] === 'number' &&
    typeof value['code'] === 'string' &&
    typeof value['detail'] === 'string'
  );
}

export function parseProblem(body: unknown, fallbackStatus: number): ProblemDetails {
  if (isProblemDetails(body)) {
    return {
      ...body,
      fields: Array.isArray(body.fields) ? body.fields : [],
    };
  }

  return {
    type: 'https://api.onmangeou.ci/problems/internal-error',
    title: 'Incident temporaire',
    status: fallbackStatus,
    code: 'INTERNAL_ERROR',
    detail: 'Un incident temporaire est survenu. Reessayez dans un instant.',
    requestId: '',
    fields: [],
  };
}

export function secondsUntil(isoDate: string, nowMs = Date.now()): number {
  const expiresAt = Date.parse(isoDate);
  if (Number.isNaN(expiresAt)) {
    return 60;
  }
  return Math.max(1, Math.floor((expiresAt - nowMs) / 1000));
}
