# Honu SaaS Starter

This is a starter template for building a SaaS application using **Next.js** with support for authentication, Stripe integration for payments, and a dashboard for logged-in users.

## Running with or without Database

This project can run in two modes:

- **Static Mode**: Run as a static site without database, authentication, or payments (perfect for landing pages)
- **Full Mode**: Full SaaS features with database, auth, and Stripe integration

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed configuration instructions.

## Prerequisites

Before running the project locally, make sure you have the following installed:

- **Docker Desktop**: Runs Postgres and any other services via containers
- **Node.js (LTS) via nvm**: Recommended Node 20 LTS (Node 19+ supported)
- **Git**: To clone the repository
- **pnpm**: Preferred package manager for this project
- **Stripe account + secret key**: Required for local development. You'll use your test mode secret key

> **Note**: A **Stripe account** is required even for local development so the app can make API calls in test mode. The Dockerized stack handles webhooks for you—no Stripe CLI needed.

### GitHub setup

Before cloning the repository, make sure your GitHub access is set up:

- Create or sign in to your **GitHub** account
- Configure your Git identity (once per machine):

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

- Set up **SSH** for passwordless access (recommended):

```bash
ssh-keygen -t ed25519 -C "you@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
# Copy the printed key and add it to GitHub → Settings → SSH and GPG keys
```

- Verify your connection:

```bash
ssh -T git@github.com
```

### Install Docker Desktop

**macOS:**

1. Download Docker Desktop for Mac (Apple silicon or Intel) from [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Install and open Docker Desktop
3. Verify installation:
   ```bash
   docker --version
   docker compose version
   ```

**Windows:**

1. Install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
2. Enable the recommended WSL 2 integration during setup
3. Verify installation with `docker --version`

**Linux:**

1. Install the [Docker Engine](https://docs.docker.com/engine/install/) and Docker Compose for your distro
2. Add your user to the `docker` group so you can run Docker without `sudo`
3. Verify with `docker --version` and `docker compose version`

### Install Node.js with nvm

We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node versions:

1. **Install nvm:**

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   # Restart your shell, then load nvm (if needed)
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
   ```

2. **Install and use Node LTS (recommended):**

   ```bash
   nvm install --lts
   nvm use --lts
   node -v
   pnpm -v
   ```

3. **Alternative: specific version:**
   If you prefer a specific version, install Node 20.x or newer (Node 19+ supported):
   ```bash
   nvm install 20
   nvm use 20
   ```

### Install pnpm (via Corepack)

We use **pnpm**. With modern Node versions, use Corepack to activate it:

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm -v
```

### Stripe account and keys (required)

1. Create or sign in to your account at [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to **Test mode**
3. Copy your **Secret key** (starts with `sk_test_...`)
4. Add it to your environment file as your Stripe secret. For example:

```bash
# .env
STRIPE_SECRET_KEY=sk_test_********************************
```

The local Docker setup manages webhooks automatically. You do not need the Stripe CLI for local development.

## Recommended: Cursor Pro + Honu MCP

For the best developer experience and AI-assisted workflows:

- Install **Cursor** and use a **Pro subscription**.
- Connect the **Honu MCP** within Cursor. You can copy the required MCP configuration from your **Honu business dashboard**.
  - Deve Tools page URL format (replace with your business ID): `https://dashboard.honu.ai/business/{BUSINESS_ID}/developers`

## Run the App Locally

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_DIRECTORY>
```

### 2. Open the project in Cursor

- Open **Cursor** and select the cloned folder
- If you use Cursor Pro + Honu MCP, ensure your MCP is connected (see your Honu business dashboard Deve Tools page)

### 3. Verify Docker and Node are available

```bash
docker --version
docker compose version
node -v
pnpm -v
```

> **Tip**: Make sure Docker Desktop is running before proceeding.

### 4. Generate your .env file

From the `next-saas-starter` project root, run:

```bash
pnpm run setup:env
```

What this does:

- Prompts for hostname and port, e.g., `localhost` and `3000`
- Prompts for your Stripe Secret Key (starts with `sk_`)
- Uses Docker to run the Stripe CLI and fetch a local `STRIPE_WEBHOOK_SECRET` that forwards to `/api/stripe/webhook`
- Generates a secure `AUTH_SECRET`
- Writes all values to a new `./.env` file

The resulting `.env` includes at least:

```bash
POSTGRES_URL=postgresql://postgres:postgres@localhost:5433/saas_db
BASE_URL=http://localhost:3000
HOST=localhost
PORT=3000
STRIPE_API_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
AUTH_SECRET=...
```

> **Tip**: Ensure Docker Desktop is running; the script uses a `stripe/stripe-cli` Docker container to obtain the webhook secret.

### 5. Start services and run the app

Use the following command to start the services and run the app:

```bash
make run-dev
```

What this command does:

- **Docker Compose (local services)**: Brings up Postgres on port 5433 with a persistent volume. It may also start a `stripe-cli` listener that forwards webhooks to your app
- **Database setup**: Runs migrations and seeds your database using pnpm scripts
- **Dev server**: Launches the Next.js development server at your configured `HOST:PORT` (e.g. `localhost:3000`)

Drizzle Studio quick reference:

- **Open**: Run `pnpm drizzle:studio` from your project root
- **Purpose**: Modern database browser and query interface for inspecting schemas/tables, browsing data, and running SQL during development
- **Features**: Visual table browser, SQL query editor, data editing capabilities, and schema visualization
- **Docs**: See [Drizzle Studio documentation](https://orm.drizzle.team/studio)

### 6. Switch the landing page to Product mode

To display pricing and the login/sign-up buttons on the landing page, enable Product mode in `content.json` (project root of `next-saas-starter`):

```json
{
  "metadata": {
    "product": true
  }
}
```

Effects:

- Shows pricing section on `/`
- Reveals Login and Sign Up buttons on the navbar

## Troubleshooting

**Docker isn't running**
Open Docker Desktop and wait until it reports that it is running, then retry `docker compose up -d`.

**Port already in use**
Common conflicts:

- App port (default `3000`): change `PORT` in your `.env` (e.g., `3001`) or stop the conflicting process
- Postgres port (`5433` on host): stop the process using `5433` or change the host port mapping in `docker-compose.yml`

**Postgres already running locally**
If you have a local Postgres service running, it won't conflict unless it uses host port `5433`. Either stop your local Postgres or edit `docker-compose.yml` to map another host port (e.g., `5434:5432`), and update `POSTGRES_URL` in `.env` accordingly.

**Node version issues**
Use `nvm use --lts` (or the project's specified version) and reinstall dependencies: `rm -rf node_modules && pnpm install`.

**Stripe webhook setup issues**
Ensure Docker is running and your Stripe secret key is valid (starts with `sk_`). Re-run the env setup: `pnpm run setup:env`.

## Development Workflow

Once you have the app running locally, here are the key development tools and workflows to help you build your product efficiently.

### 1. Connect Honu MCP in Cursor

The Honu MCP (Model Context Protocol) provides AI-powered assistance directly in Cursor for managing your business model and development workflow.

> **Recommended Setup**: For the best experience with Honu MCP, we recommend using **Cursor Pro** with **Claude 4.5 Sonnet** or higher. This combination provides:
>
> - **Enhanced AI capabilities**: More sophisticated reasoning and code generation
> - **Better context understanding**: Improved ability to understand complex business requirements
> - **Faster response times**: Optimized performance for development workflows
> - **Reliable uptime**: Priority access to the latest AI models
>
> While Honu MCP works with other AI models, the Pro subscription with Claude 4.5 Sonnet delivers the most comprehensive and reliable development assistance.

**Setup Steps:**

1. **Get your MCP connection details:**
   - Log in to your [Honu platform dashboard](https://dashboard.honu.ai)
   - Navigate to the **Deve Tools** section
   - Copy your MCP connection configuration

2. **Configure Cursor:**
   - Open Cursor Settings (Cmd/Ctrl + ,)
   - Go to **Features** → **Model Context Protocol**
   - Add a new MCP server with your Honu configuration
   - Test the connection to ensure it's working

3. **Start using Honu MCP:**

You can now start developing your product with the help of Honu MCP in Cursor:

- **Review your Trello board**: Ask the Cursor AI agent to analyze your Trello product board and understand your project structure
- **Task Execution**: Get the Cursor AI agent to execute the tasks on the Trello board
- **Task Tracking**: As it executes the tasks, the Cursor AI agent will move the task in the correct column on the Trello board e.g. "In Progress" to "In Review" to "QA" to "Done".
- **Collaboration**: The Cursor AI agent will request your approval to proceed with the task. You will need to provide QA before final sign off.
- **Add Tasks**: You can ask the Cursor AI agent to add tasks to the Trello backlog.

### 2. Component Development with Storybook

Storybook helps you develop and test UI components in isolation, making it easier to build a consistent design system.

**Start Storybook:**

```bash
pnpm storybook
```

This opens Storybook at `http://localhost:6006` where you can:

- **View all components**: Browse your component library with live examples
- **Test different states**: See how components look with various props and states
- **Interactive development**: Modify component props in real-time using Storybook controls
- **Visual testing**: Ensure components work across different scenarios

**Component Story Structure:**
Each component in the `components/` directory has a corresponding `.stories.tsx` file. For example:

- `components/hero-section/HeroSection.tsx` → component implementation
- `components/hero-section/HeroSection.stories.tsx` → Storybook stories

**Best Practices:**

- Create stories for different component states (default, loading, error, etc.)
- Use Storybook controls to make props interactive
- Test responsive behavior across different viewport sizes
- Document component usage and props in your stories

### 3. Database Management with Drizzle Studio

Drizzle Studio provides a visual interface to inspect and manage your database during development.

**Start Drizzle Studio:**

```bash
pnpm db:studio
```

This opens Drizzle Studio in your browser where you can:

- **Browse tables**: View all your database tables and their structure
- **Inspect data**: See actual data in your tables with filtering and sorting
- **Run queries**: Execute SQL queries directly against your database
- **Monitor relationships**: Visualize foreign key relationships between tables

**Database Schema Location:**

- Schema definitions: `lib/db/schema.ts`
- Database queries: `lib/db/queries.ts`
- Migrations: `lib/db/migrations/`

**Common Database Tasks:**

```bash
# Generate new migration after schema changes
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# Reset and reseed database (development only)
make db-clean
make run-dev
```

### Development Tips

- **Hot Reload**: All three tools (Next.js dev server, Storybook, Drizzle Studio) support hot reloading
- **Parallel Development**: Run multiple tools simultaneously in different terminal tabs
- **Component-First**: Use Storybook to build components before integrating them into pages
- **Data-Driven**: Use Drizzle Studio to understand your data structure and test queries
- **Business Alignment**: Use Honu MCP to ensure your development aligns with your business strategy
