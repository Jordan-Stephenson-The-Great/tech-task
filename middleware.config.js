const { ctCustomQueries } = require('./extensions/ct');
require('dotenv').config();

const stringToArrayValue = (val, separator = ',') => {
  return typeof val === 'string' ? val.split(separator) : [];
}

module.exports = {
  integrations: {
    ct: {
      location: '@vsf-enterprise/commercetools-api/server',
      configuration: {
        api: {
          uri: 'https://api.commercetools.com/vsfproject/graphql',
          apiHost: 'https://api.europe-west1.gcp.commercetools.com',
          authHost: 'https://auth.europe-west1.gcp.commercetools.com',
          projectKey: 'vsfproject',
          clientId: 'spWuZtm0rgAB_jYPLIQnf7YK',
          clientSecret: 'xBc353q4Q2VL3QoWKZqV_6KAujnJLHpf',
          scopes: ['manage_my_business_units:vsfproject', 'manage_my_profile:vsfproject', 'manage_my_payments:vsfproject', 
          'manage_stores:vsfproject', 'manage_my_quote_requests:vsfproject', 'manage_my_quotes:vsfproject', 'view_products:vsfproject', 
          'manage_my_orders:vsfproject', 'view_categories:vsfproject', 'create_anonymous_token:vsfproject', 'view_published_products:vsfproject', 'manage_my_shopping_lists:vsfproject']
        },
        serverApi: {
          clientId: '5lZueZzKKy-cknhYbmJ1Pkey',
          clientSecret: 'GJjOy8uIGyIeT8buuohqeSFkIA3ymY1L',
          scopes:['manage_customers:vsfproject', 'manage_products:vsfproject', 'view_project_settings:vsfproject'],
          operations: stringToArrayValue(process.env.VSF_SERVER_API_OPERATIONS),
        },
        acceptLanguage: [
          'en-US',
          'de-DE',
          'de',
          'en'
        ],
        currency: 'USD',
        country: 'US',
        // languageMap: {
        //   'en-de': ['de-DE'],
        //   'en-us': ['en-us'],
        //   'de': ['de-DE', 'de'],
        // }
      },
      customQueries: ctCustomQueries
    },
    sb: {
      location: '@vue-storefront/storyblok/server',
      configuration: {
        token: 'UzxawAdwx8xJxxOQNdMfkgtt',
        cacheProvider: 'memory',
      },
    },
  }
};
