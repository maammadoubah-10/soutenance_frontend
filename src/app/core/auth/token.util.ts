export interface JwtUser {
  id?: number;
  username?: string;
  roles: string[];          // ex: ['ADMIN', 'PERSONNEL']
  raw?: any;                // payload brut, au cas où
}

function base64UrlDecode(str: string): string {
  // compatibilité atob/base64url
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = str.length % 4;
  if (pad) str += '='.repeat(4 - pad);
  return atob(str);
}

export function decodeJwt(token?: string | null): JwtUser | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    // Les backends Spring utilisent souvent `roles`, `authorities`, ou `scope`
    const possibleRoles =
      payload.roles ||
      payload.authorities ||
      payload.scopes ||
      payload.scope ||
      [];

    const roles: string[] = Array.isArray(possibleRoles)
      ? possibleRoles.map((r: any) => String(r).replace(/^ROLE_/, ''))
      : String(possibleRoles)
          .split(/\s|,/)
          .filter(Boolean)
          .map(r => r.replace(/^ROLE_/, ''));

    return {
      id: payload.id ?? payload.userId ?? payload.sub ?? undefined,
      username: payload.username ?? payload.sub ?? undefined,
      roles,
      raw: payload,
    };
  } catch {
    return null;
  }
}
