#!/usr/bin/env python3

import random
import string
import subprocess

def get_stripe_webhook_secret(stripe_key: str, host_url: str) -> str:
    response = subprocess.run([
        "docker",
        "run",
        "--rm",
        "stripe/stripe-cli",
        f"--api-key={stripe_key}",
        "listen",
        "--print-secret",
        "--forward-to",
        f"{host_url}/api/stripe/webhook"
    ], capture_output=True)
    if response.returncode != 0:
        raise Exception(f"Failed getting a Stripe local webhook secret, {response.stdout} {response.stderr}")
    webhook_secret = response.stdout.decode().strip()
    return webhook_secret

def request_stripe_key():
    """ request stripe api key from user """
    api_key = input("Give me you stripe api key: ")
    if not api_key.startswith("sk_"):
        raise Exception("This is not a valid Stripe api key. Get you stripe key from: https://dashboard.stripe.com/")
    return api_key

def request_host_and_port():
    host = input("Enter a hostname (default localhost): ")
    port = input("Enter a port (default 3000): ")
    if host == "":
        host = "localhost"
    if port == "":
        port = "3000"

    return f"http://{host}:{port}", host, port

def get_auth_secret_key():
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(50))

def get_postgres_connection_string():
    return 'postgresql://postgres:postgres@localhost:5433/saas_db'

def write_dotenv(dotenv_variables: dict):
    with open('./.env', 'w') as ofile:
        for variable, value in dotenv_variables.items():
            ofile.write(f"{variable}={value}\n")
    print("Variables were written in ./.env")

if __name__ == "__main__":
    POSTGRES_URL = get_postgres_connection_string()
    BASE_URL, HOST, PORT = request_host_and_port()
    STRIPE_API_KEY = request_stripe_key()
    STRIPE_WEBHOOK_SECRET = get_stripe_webhook_secret(STRIPE_API_KEY, BASE_URL)
    AUTH_SECRET = get_auth_secret_key()

    dotenv_variables = {
        'POSTGRES_URL': POSTGRES_URL,
        'BASE_URL': BASE_URL,
        'HOST': HOST,
        'PORT': PORT,
        'STRIPE_API_KEY': STRIPE_API_KEY,
        'STRIPE_WEBHOOK_SECRET': STRIPE_WEBHOOK_SECRET,
        'AUTH_SECRET': AUTH_SECRET,
        'NEXT_PUBLIC_POSTHOG_KEY': 'phc_***',
        'NEXT_PUBLIC_POSTHOG_HOST': 'https://us.i.posthog.com',
        'NEXT_PUBLIC_FORMBRICKS_ENVIRONMENT_ID': '*****',
        'NEXT_PULIC_FORMBRICKS_API_URL': 'https://app.formbricks.com'
    }
    write_dotenv(dotenv_variables)