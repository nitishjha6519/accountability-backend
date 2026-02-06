# NestJS Project Setup Guide

## Project Overview
This is a NestJS TypeScript project set up with Express, TypeScript, and development tooling.

## Development

### Available Commands
- `npm run start` - Start the application in production mode
- `npm run start:dev` - Start in development mode with watch mode
- `npm run start:debug` - Start with debugging enabled
- `npm run build` - Build the project (compiles TypeScript to JavaScript)
- `npm run test` - Run unit tests
- `npm test -- --watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests

### Project Structure
```
src/
  ├── app.controller.ts    - Main controller
  ├── app.module.ts        - Root module
  ├── app.service.ts       - Main service
  └── main.ts              - Application entry point
test/                       - E2E tests
dist/                       - Compiled JavaScript (generated)
```

### Getting Started
1. Development server runs on http://localhost:3000
2. Modify `src/main.ts` to change the port or other configurations
3. Create new modules, controllers, and services using the NestJS CLI:
   - `nest generate module feature-name`
   - `nest generate service feature-name`
   - `nest generate controller feature-name`

## Debugging
Use the "NestJS: Start Development" task in VS Code to run the project in watch mode. The application will automatically restart when files change.

## Documentation
For more information, visit [NestJS Documentation](https://docs.nestjs.com)
