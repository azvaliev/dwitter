# Description

Basic app consuming the Twitter API feed to show feeds of popular Twitter dev users. Implemented rate limiting based on IP.

## Getting Started

Running the app locally is pretty simple.
First, clone the repo

```bash
git clone https://github.com/azvaliev/dwitter.git
```

See requirements and steps below

### Requirements

- Twitter API Bearer Token - [Here's a guide if you don't have one](https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens)
- [NodeJS v16+](https://nodejs.org)
- [pnpm](https://pnpm.io) - technically optional, but that is what the lockfile is based on

### Environment

Create a `.env` in the root directory, and add the following

- Add your Twitter API Bearer token under the name `TWITTER_BEARER_TOKEN`

### Install Dependencies

```bash
pnpm install
```

### Run the dev server

```bash
pnpm dev
```

It will be visible on [localhost:3000](http://localhost:3000)

### Build and start Prod Server

```bash
pnpm build
pnpm start
```

It will be visible on [localhost:3000](http://localhost:3000)
