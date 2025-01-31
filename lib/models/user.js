'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class User extends Model {

    static get tableName() {
        return 'user';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            username: Joi.string().min(3).required().example('johndoe').description('Username'),
            firstName: Joi.string().min(3).required().example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).required().example('Doe').description('Lastname of the user'),
            email: Joi.string().email().required().example('john.doe@example.com').description('Email address'),
            password: Joi.string().min(8).required().description('Password (min 8 characters)'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }
};
