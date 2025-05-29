# Quick Start Script for Secure Certificate Verification System
# This script sets up the development environment

echo "🚀 Setting up Secure Certificate Verification System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client && npm install && cd ..

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your MongoDB URI and secrets"
    echo "   - Get MongoDB URI from: https://cloud.mongodb.com/"
    echo "   - Generate JWT secret: openssl rand -base64 32"
    echo "   - Generate encryption key: openssl rand -hex 16"
fi

echo "✅ Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Run 'npm run seed' to populate sample data"
echo "3. Run 'npm run dev' to start the backend server"
echo "4. In another terminal, run 'cd client && npm run dev' for frontend"
echo ""
echo "🌐 Application will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "🎓 Sample admin account after seeding:"
echo "   Email: admin@udsm.ac.tz"
echo "   Password: SecurePass123!"
