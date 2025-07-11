# Kenyan Exam Manager

A web application for managing exams.

## Deployment Instructions

1. Install dependencies:
```bash
bun install
```

2. Build for production:
```bash
bun run build
```

3. Deploy to Netlify:
```bash
bun run deploy
```

## Environment Variables

Create a `.env` file for development and `.env.production` for production with the following variables:
- `REACT_APP_API_URL`
- `NODE_ENV`

## Project Structure

- `/App` - Main application code
- `/components` - Reusable React components
- `/hooks` - Custom React hooks
- `/types` - TypeScript type definitions
- `/assets` - Static assets

## Technologies Used

- React
- Expo Router
- TypeScript
- Bun
- Netlify
