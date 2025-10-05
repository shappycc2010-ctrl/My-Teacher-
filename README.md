
# My Teacher - Starter Template

This starter repo contains:
- server/ (Express backend)
- client/ (React frontend)

How to run locally:
1. Create two terminals
2. Start server:
   cd server
   npm install
   create .env with OPENAI_API_KEY, OPENAI_MODEL (gpt-4o-mini), ADMIN_KEY
   npm run dev
3. Start client:
   cd client
   npm install
   REACT_APP_API_BASE=http://localhost:5000
   npm start

Deployment:
- Push to GitHub
- Create two Render web services (server and client)
- Add environment variables on Render for server
