#!/bin/bash
SECRET=$(grep STRIPE_API_KEY .env | cut -d '=' -f 2)
echo STRIPE_WEBHOOK_SECRET=`docker run stripe/stripe-cli --api-key=${SECRET} listen --print-secret --forward-to localhost:3001/api/stripe/webhook` >> .env
echo AUTH_SECRET=`openssl rand -base64 32` >> .env