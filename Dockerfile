ARG server_tag=latest

# Stage 1: Build the frontend application
FROM node:18.19.1-buster-slim as frontend

WORKDIR /src/dingolytics/

# Install project dependencies via Yarn
ADD package.json yarn.lock ./
RUN yarn install
# RUN yarn install --frozen-lockfile

# Copy project source and build
COPY . .
RUN yarn build

# Stage 2: Create image with full application code
FROM dingolytics/dingolytics-backend:$server_tag as application

# Copy the frontend build to the backend image
COPY --from=frontend /src/dingolytics/build/ /var/www/dingolytics/
