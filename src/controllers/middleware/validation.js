const Joi = require('joi');
const funcurl = require('funcurl');
const httpStatus = require('http-status-codes');
const logger = require('../../utils/logger')(
    'src/controllers/middleware/validation.js'
);
const rules = require('../../utils/validation-rules');
const { pick } = require('lodash');

const um = new funcurl();

um.add(
    '/data/retrieve',
    'GET',
    Joi.object().keys({
        key: rules.id.required()
    })
);

const options = {
    abortEarly: true,
    stripUnknown: true
};

class JoiError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'JoiValidation';
        this.code = code;
    }
}

module.exports = (config = {}) => (req, res, next) => {
    const route = req.path;
    const method = req.method;

    logger.joi(`Validating ${method}:${route}`);

    if (um.match(route, method)) {
        const { func, params } = um.get(route, method);
        if (func) {
            const reqData = { ...req.body, ...req.query };
            const srcData = { ...reqData, ...params };
            return Joi.validate(srcData, func, options, (err, data) => {
                // replace original data with sanitized data
                if (err) {
                    throw err;
                } else {
                    if (config.pack) {
                        req._sanitized = data;
                    } else {
                        req.body = pick(data, req.body);
                        req.query = pick(data, req.query);
                        req.params = pick(data, req.params);
                    }
                    next();
                }
            });
        } else {
            throw new Error(`Logic error inside URL matcher`);
        }
    } else {
        next(
            new JoiError(
                `Validation not defined for route ${method}:${route}`,
                httpStatus.NOT_FOUND
            )
        );
    }
};
