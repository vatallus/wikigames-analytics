#!/bin/bash

# Update DATABASE_URL in .env file
if [ -f .env ]; then
    # Backup current .env
    cp .env .env.backup
    
    # Update DATABASE_URL
    if grep -q "DATABASE_URL" .env; then
        # Replace existing DATABASE_URL
        sed -i '' 's|DATABASE_URL=.*|DATABASE_URL="postgresql://wikigames:wikigames123@localhost:5432/wikigames?schema=public"|g' .env
        echo "✅ Updated DATABASE_URL in .env"
    else
        # Add DATABASE_URL if not exists
        echo 'DATABASE_URL="postgresql://wikigames:wikigames123@localhost:5432/wikigames?schema=public"' >> .env
        echo "✅ Added DATABASE_URL to .env"
    fi
    
    # Also ensure Redis settings are correct
    if ! grep -q "REDIS_HOST" .env; then
        echo "REDIS_HOST=localhost" >> .env
        echo "REDIS_PORT=6379" >> .env
        echo "REDIS_PASSWORD=" >> .env
        echo "✅ Added Redis configuration to .env"
    fi
    
    echo ""
    echo "✅ Environment file updated successfully!"
    echo "📋 Backup saved as .env.backup"
else
    echo "❌ Error: .env file not found"
    echo "💡 Copy .env.example to .env first:"
    echo "   cp .env.example .env"
    exit 1
fi
