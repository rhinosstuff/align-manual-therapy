const { User, Service } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        // Find all users
        users: async () => {
            return User.find().populate('service');
        },
        // Find one user by email
        user: async (parent, { email } ) => {
            return User.findOne({ email }).populate('service');
        },
        // View own account
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('service');
            }
            throw AuthenticationError;
        },
        // Query a service -- not sure if we'll use
        // If we do, add to typeDefs and client side queries
        // service: async (parent, { name }) => {
        //     const params = name ? { name } : {};
        //     return Service.find(params);
        // },
        // Query all services
        services: async () => {
            try {
                return await Service.find().populate('practitioner');
            } catch (error) {
                console.error('Error fetching services', error);
                throw new Error('Failed to fetch services.');
            }
        }
    }, 

    Mutation: {
        login: async (parent, { email, password }) => {
            try {
                const user = await User.findOne({ email });
  
                if (!user) {
                    throw new Error('Incorrect email or password.')
                }

                const correctPassword = await user.isCorrectPassword(password);

                if (!correctPassword) {
                    throw new Error('Incorrect email or password.');
                }

                const token = signToken(user);
    
                return { token, user };
            } catch (error) {
                console.error('Login error', error.message);
            }
        },
        createUser: async(parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
    },
};

module.exports = resolvers;