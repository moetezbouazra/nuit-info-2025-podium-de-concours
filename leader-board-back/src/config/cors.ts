// Parse CORS origins from environment variable
function getCorsOrigins(): string | string[] {
  const corsOrigin = process.env.CORS_ORIGIN;
  if (!corsOrigin || corsOrigin === '*') {
    return '*';
  }
  // Support comma-separated origins
  const origins = corsOrigin.split(',').map(o => o.trim());
  return origins.length === 1 ? origins[0] : origins;
}

export const corsOrigins = getCorsOrigins();
export const isWildcard = corsOrigins === '*';
