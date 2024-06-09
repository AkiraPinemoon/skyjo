# SKYJO ONLINE

This is a web version of the popular cardgame Skyjo. It is written in Nuxt 3

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

### Development Server

Running the following commands will start a development server on `http://localhost:3000`:

```bash
# starts developmend database
docker compose up -d

# starts nuxt development server
pnpm run dev
```

### Production Server

To deploy Skyjo you can download a prebuilt image from github or user the dockerfile to build your own.
Make sure to set the MONGO_URL environment variable to the connection string of your database.
For the database you can either host your own MongoDB instance or use MongoDB's free tier which should be more than enough for this project.
