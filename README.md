# Farm Fresh App - version 2.0

## Introduction

New and updated version of Farm fresh with the latest versions of my tech stack, this app needed to be updated due to it's version of Django no longer being supported. In this release I will also be updating other software related to this project.

Version 1.0 can be found in [this repository](https://github.com/Joao4569/farm_fresh).

## Table of Contents

- [Project Scope](#project-scope)

- [Docker](#docker)
  - [Development](#development)
  - [Local Stripe Webhooks](#local-stripe-webhooks)
  - [Deployment](#deployment)

- [Access Control](#access-control)
  - [Super User](#super-user)
  - [Testing Card Payments](#testing-card-payments)

## Project Scope

In this release I will be doing the following:

- Django version 3.2.13 will be updated to Version 5.2.
- I will make use of Python version 3.12.10 instead of 3.9.18.
- Upgrade all dependencies.
- Make use of Docker for containerization.
- Host the deployed app and database on Render instead of Heroku.
- Unit test are coming soon....

## Docker

### Development

For development purposes, Docker is used to containerize the application, ensuring consistency across different environments. The development setup now lives directly in the project root at `farm_fresh_v_2_0_project/`, so there is a single place to start the app and database together.

- **Dockerfile.dev**: Defines the local development image used for Django's development server.
- **docker-compose.yml**: Starts both the Django app and the PostgreSQL database for local development.
- **Dockerfile**: Remains the production-oriented image used for deployment.
- **Volumes**: The current directory is mounted into the container to allow real-time updates during development.

To start the application in a development environment with a new image, run the following commands from the repository root:

```powershell
cd .\farm_fresh_v_2_0_project
docker compose up -d --build
```

If you need to create a local environment file, use `env.example` as the template for `env.py`.

To confirm both services are running:

```powershell
docker compose ps
```

To stop the local stack:

```powershell
docker compose down
```

As a best practice I clear the cache whenever significant changes have been made by using the following command:

```powershell
docker system prune
```

### Local Stripe Webhooks

For local Stripe testing, keep the production webhook configured in the Stripe
Dashboard for the deployed Render site and use the Stripe CLI to forward webhook
events to your local Docker app.

Start the local app first:

```powershell
cd .\farm_fresh_v_2_0_project
docker compose up -d --build
```

This project also includes an optional `stripe-cli` Docker Compose service so
the Stripe CLI stays local to the app instead of being installed globally on
your machine.

To authenticate the CLI in the container:

```powershell
cd .\farm_fresh_v_2_0_project
docker compose run --rm stripe-cli login
```

Then start the webhook forwarding service:

```powershell
docker compose --profile stripe up stripe-cli
```

If you prefer to run the CLI outside Docker, authenticate the Stripe CLI and
forward the webhook events used by this project to the local checkout webhook
endpoint:

```powershell
stripe login
stripe listen --events payment_intent.succeeded,payment_intent.payment_failed --forward-to localhost:8000/checkout/wh/
```

The Stripe CLI will output a temporary webhook signing secret that begins with
`whsec_`. Use that value for `STRIPE_WH_SECRET` in your local `env.py`.

This allows local development to receive Stripe webhook events without changing
or interrupting the production webhook destination configured for Render.

### Deployment

For deployment, the production image is built from `farm_fresh_v_2_0_project/Dockerfile` and pushed to GitHub Packages. This image is then used by Render to host the application. The deployment process involves the following steps:

1. **Build the Docker Image**: The Docker image is built locally using the `Dockerfile`.
2. **Push to GitHub Packages**: The built image is pushed to GitHub Packages using a Personal Access Token (PAT) for authentication. This ensures secure read and write access for Render.
3. **Render Integration**: Render pulls the Docker image from GitHub Packages and uses it to deploy the application.

This process is currently manual, requiring the image to be rebuilt and pushed for every new change. Automation of this workflow is planned for future iterations.

To push the image to GitHub Packages, use the following commands:

```powershell
cd .\farm_fresh_v_2_0_project
docker build -f Dockerfile -t ghcr.io/joao4569/ocean-basket-app-image .
docker push ghcr.io/joao4569/ocean-basket-app-image:latest
```

Ensure that the Personal Access Token is configured in your Docker CLI for authentication with GitHub Packages.

## Access Control

I have created a few users which will be helpful for testing the project:

### Super User

I created a Superuser in order to access the admin functions of Django. The Superuser is also what I use to create employees, as it is now a new employee can register his or her self the same way as a customer and with the Superuser logged in, one can allocate the "is Staff" property on the admin site.

Credentials:

- Username: **FarmFreshSuper**
- Password: **Joao4569**

### Testing Card Payments

To test card payments without incurring any charges please make use of the card number "4242 4242 4242 4242", with CVC "123" and ZIP "12345" and make sure that the expiry date of the card is anywhere in the future.
