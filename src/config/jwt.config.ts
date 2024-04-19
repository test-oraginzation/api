export const JwtConfig = {
  secret: process.env.PRIVATE_KEY || 'SECRET',
  signOptions: {
    expiresIn: '24h',
  },
  global: true,
};
