'use strict';

const Joi = require('joi');

module.exports = [
    {
        method: 'post',
        path: '/user',
        options: {
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    username: Joi.string().min(3).required().example('johndoe').description('Username'),
                    firstName: Joi.string().min(3).required().example('John').description('Firstname of the user'),
                    lastName: Joi.string().min(3).required().example('Doe').description('Lastname of the user'),
                    email: Joi.string().email().required().example('john.doe@example.com').description('Email address'),
                    password: Joi.string().min(8).required().description('Password (min 8 characters)')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            return await userService.create(request.payload);
        }
    },
    {
        method: 'get',
        path: '/user',
        options: {
            tags: ['api'],
            description: 'Get all users'
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            return await userService.list();
        }
    },
    {
        method: 'get',
        path: '/users',
        options: {
            tags: ['api'],
            description: 'Get all users (alias of /user)'
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            return await userService.list();
        }
    },
    {
        method: 'delete',
        path: '/user/{id}',
        options: {
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().required().description('User ID to delete')
                })
            },
            description: 'Delete a user by ID'
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            await userService.delete(request.params.id);
            return '';
        }
    },
    {
        method: 'patch',
        path: '/user/{id}',
        options: {
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().required().description('User ID to update')
                }),
                payload: Joi.object({
                    username: Joi.string().min(3).optional().example('johndoe').description('Username'),
                    firstName: Joi.string().min(3).optional().example('John').description('Firstname of the user'),
                    lastName: Joi.string().min(3).optional().example('Doe').description('Lastname of the user'),
                    email: Joi.string().email().optional().example('john.doe@example.com').description('Email address'),
                    password: Joi.string().min(8).optional().description('Password (min 8 characters)')
                }).min(1)
            },
            description: 'Update user information'
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            return await userService.update(request.params.id, request.payload);
        }
    },
    {
        method: 'post',
        path: '/user/login',
        options: {
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required().example('john.doe@example.com').description('Email address'),
                    password: Joi.string().required().description('Password')
                })
            },
            description: 'Login with email and password'
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            return await userService.login(request.payload.email, request.payload.password);
        }
    }
];