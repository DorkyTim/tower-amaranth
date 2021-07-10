# tower-amaranth

Step 1: Create .env file with the following:

TOKEN=your-token-goes-here
DATABASE_URL=postgres_connectionstring
ENV=DEV

Set ENV to prod for ssl requried conneciton used for Heroku Deployment

Step 2: Execute node dbInit.js once to setup tables.