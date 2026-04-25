# Start with official PHP 8.2 image
FROM php:8.2-cli

# Install system dependencies required by Laravel and PostgreSQL
RUN apt-get update -y && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    curl

# Install PHP database extensions (PostgreSQL & MySQL support)
RUN docker-php-ext-install pdo pdo_pgsql pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory inside the container
WORKDIR /app

# Copy all your Laravel files into the container
COPY . /app

# Install Laravel dependencies (ignoring local dev packages)
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Ensure storage folder has the right permissions
RUN chmod -R 775 storage bootstrap/cache

# Render automatically assigns a port, we expose it here
EXPOSE 8000

# 🔥 The Magic Command: Automatically run migrations, then start the server
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}