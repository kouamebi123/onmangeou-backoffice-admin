import type { NextConfig } from 'next';

const DEFAULT_API_ORIGIN = 'https://onmangeou-backend-api-production.up.railway.app';

/** Origine de l'API (schéma + hôte), d'où viennent les images et les appels du navigateur. */
function apiOrigin(): string {
  const configured =
    process.env.API_BASE_URL ?? process.env.ONMANGEOU_API_BASE_URL ?? DEFAULT_API_ORIGIN;
  try {
    return new URL(configured).origin;
  } catch {
    return DEFAULT_API_ORIGIN;
  }
}

/**
 * En-têtes de sécurité envoyés avec chaque page.
 *
 * La politique de contenu limite d'où peuvent venir scripts, images et appels
 * réseau, interdit l'affichage du site dans une page tierce (détournement de
 * clic) et l'envoi de formulaires vers un autre site.
 */
function securityHeaders(): Array<{ key: string; value: string }> {
  const api = apiOrigin();
  const development = process.env.NODE_ENV !== 'production';
  const contentSecurityPolicy = [
    "default-src 'self'",
    // Next.js injecte de petits scripts en ligne ; aucun script d'un autre domaine n'est accepté.
    `script-src 'self' 'unsafe-inline'${development ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    // Les photos viennent de l'API ou du stockage d'images : toute image en HTTPS est acceptée, aucun script.
    `img-src 'self' data: blob: https: ${api}`,
    "font-src 'self' data:",
    `connect-src 'self' ${api}${development ? ' ws: http://localhost:*' : ''}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ');

  return [
    { key: 'Content-Security-Policy', value: contentSecurityPolicy },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'no-referrer' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
    // Le back-office ne doit apparaître dans aucun moteur de recherche.
    { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
  ];
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders() }];
  },
};

export default nextConfig;
