# Multilingual FAQ System

This project is a multilingual FAQ system built with Next.js, Prisma, Redis, and Google Gemini for translations. It allows users to retrieve FAQs in different languages, with automatic translation support for common languages like Hindi and Bengali.

## Features

- **Multilingual Support**: Fetch FAQs in different languages (e.g., English, Hindi, Bengali).
- **Automatic Translation**: Uses Google Gemini to automatically translate questions and answers.
- **Caching with Redis**: FAQs are cached for improved performance.
- **Easy to Extend**: Adding new languages or translating other content is simple.

## Tech Stack

- **Next.js**: React framework for building the frontend and API routes.
- **Prisma**: ORM for interacting with the database.
- **Redis**: Caching to improve performance and reduce API calls.
- **Google Gemini API**: Used for translating FAQ content into multiple languages.
- **Jest**: Testing framework for unit and integration tests.
- **TypeScript**: For static type checking and better developer experience.

## Setup Instructions

### Prerequisites

1. **Node.js**: Ensure you have Node.js installed. You can download it from [here](https://nodejs.org/).
2. **Redis**: Make sure you have a Redis instance running. You can use a local Redis instance or a managed Redis service like [Redis Labs](https://redislabs.com/).
3. **Google Gemini API Key**: Sign up for Google Gemini and get your API key, which will be required for translations. Store it in your `.env` file.

### Clone the repository

```bash
git clone https://github.com/your-username/multilingual-faq-system.git
cd multilingual-faq-system
```

### Install dependencies

```bash
npm install
```

### Create a .env file

Create a `.env` file in the root directory of the project and add the following variables:

```bash
DATABASE_URL=your-database-url
REDIS_URL=your-redis-url
GEMINI_API_KEY=your-google-generative-ai-api-key
```

Replace `your-database-url`, `your-redis-url`, and `your-google-generative-ai-api-key` with your actual values.

### Create a database

Run the following command to create a new database:

```bash
npx prisma db push
```

This will create a new database in your database URL.

### Run the application

To start the application, run the following command:

```bash
npm run dev
```

This will start the application on `http://localhost:3000`.

## testing

To run the tests, run the following command:

```bash
npm run test
```

## Contributing

Contributions are welcome!