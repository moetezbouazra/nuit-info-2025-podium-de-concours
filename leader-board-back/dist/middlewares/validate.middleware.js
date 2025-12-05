export function validate(schema) {
    return (req, _res, next) => {
        schema.parse(req.body);
        next();
    };
}
//# sourceMappingURL=validate.middleware.js.map