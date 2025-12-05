import { verifyToken } from '../utils/jwt.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
export function authenticate(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('No token provided');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    }
    catch {
        throw new UnauthorizedError('Invalid or expired token');
    }
}
export function requireAdmin(req, _res, next) {
    if (!req.user) {
        throw new UnauthorizedError('Authentication required');
    }
    if (req.user.role !== 'ADMIN') {
        throw new ForbiddenError('Admin access required');
    }
    next();
}
export function optionalAuth(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = verifyToken(token);
        req.user = payload;
    }
    catch {
        // Token invalid, but that's ok for optional auth
    }
    next();
}
//# sourceMappingURL=auth.middleware.js.map