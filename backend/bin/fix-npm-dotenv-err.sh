#!/bin/bash

# This error (npm could not determine executable to run) 
#   happens when dotenv-cli is not installed globally.
# This script fixes it by installing dotenv-cli globally

if ! npm list -g dotenv-cli > /dev/null 2>&1; then
  echo "Installing dotenv-cli"

  npm install -g dotenv-cli
else
  echo "dotenv-cli is already installed"
fi

# Also, we need to make sure the .env file exists and has a key/value pair for DB_FILE=db/dev.db
# Might be a better way to do this, however....
if [ ! -f .env ]; then
  echo "Creating .env file"
  echo "DB_FILE=db/dev.db" > .env
  echo "JWT_SECRET=secret" > .env
  echo "JWT_EXPIRES_IN=60000" > .env
elif ! grep -q "DB_FILE" .env; then
  echo "DB_FILE=db/dev.db" >> .env
else
    echo ".env file already exists and has the correct DB_FILE"
fi


echo "Done"
