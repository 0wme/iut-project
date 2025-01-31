'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');

module.exports = class UserService extends Service {

    async create(user) {
        const { User } = this.server.models();
        
        // Hash the password
        const hashedPassword = await Bcrypt.hash(user.password, 10);
        user.password = hashedPassword;

        return User.query().insertAndFetch(user);
    }

    list() {
        const { User } = this.server.models();
        return User.query().select('id', 'username', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt');
    }

    delete(id) {
        const { User } = this.server.models();
        return User.query().deleteById(id);
    }

    async update(id, userData) {
        const { User } = this.server.models();

        // If password is being updated, hash it
        if (userData.password) {
            userData.password = await Bcrypt.hash(userData.password, 10);
        }

        return User.query()
            .patchAndFetchById(id, userData)
            .select('id', 'username', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt');
    }

    async login(email, password) {
        const { User } = this.server.models();
        
        const user = await User.query().findOne({ email });
        
        if (!user) {
            throw Boom.unauthorized('Invalid email or password');
        }

        const isValid = await Bcrypt.compare(password, user.password);
        
        if (!isValid) {
            throw Boom.unauthorized('Invalid email or password');
        }

        return { login: 'successful' };
    }
};
