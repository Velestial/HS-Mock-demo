// ecosystem.config.js
// Start staging: pm2 start ecosystem.config.js --env staging
// Start production: pm2 start ecosystem.config.js --env production
// IMPORTANT: Replace REPLACE_WITH_REAL_* values on the VPS directly — never commit real secrets
module.exports = {
  apps: [{
    name: 'hey-skipper-api',
    script: './server/index.cjs',
    watch: false,
    instances: 1,
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
    },
    env_staging: {
      NODE_ENV: 'staging',
      PORT: 3000,
      WC_URL: 'https://heyskipper.com',
      WC_CONSUMER_KEY: 'REPLACE_WITH_REAL_WC_CONSUMER_KEY',
      WC_CONSUMER_SECRET: 'REPLACE_WITH_REAL_WC_CONSUMER_SECRET',
      STRIPE_SECRET_KEY: 'REPLACE_WITH_REAL_STRIPE_SECRET_KEY',
      FRONTEND_URL: 'https://heyskipper.com',
      FRONTEND_STAGING_URL: 'https://staging.heyskipper.com',
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      WC_URL: 'https://heyskipper.com',
      WC_CONSUMER_KEY: 'REPLACE_WITH_REAL_WC_CONSUMER_KEY',
      WC_CONSUMER_SECRET: 'REPLACE_WITH_REAL_WC_CONSUMER_SECRET',
      STRIPE_SECRET_KEY: 'REPLACE_WITH_REAL_STRIPE_SECRET_KEY',
      FRONTEND_URL: 'https://heyskipper.com',
      FRONTEND_STAGING_URL: 'https://staging.heyskipper.com',
    },
  }],
};
