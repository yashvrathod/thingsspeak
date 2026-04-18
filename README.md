# Pulse

A modern, elegant IoT platform similar to ThingSpeak, built with Next.js, PostgreSQL, Prisma, and real-time charts.

## Features

- **User Authentication**: Email/password and Google OAuth with JWT-based sessions
- **Channels System**: Create multiple channels with up to 8 data fields each (like ThingSpeak)
- **API Key Management**: Time-based API keys with automatic expiry and granular access control
- **Data Visualization**: Real-time interactive charts with historical data filtering
- **Device Simulator**: Test API integration without hardware
- **Data Export**: Export channel data to CSV or JSON
- **Projects Library**: Admin-uploaded IoT projects with Google Drive links
- **Admin Panel**: User management, API usage stats, and project management
- **Role-Based Access**: User and Admin roles with different permissions

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL (with Prisma ORM)
- **Charts**: Recharts
- **Authentication**: NextAuth.js with JWT
- **Real-time**: Socket.io (ready for WebSocket implementation)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or Neon)
- Google OAuth credentials (optional, for Google sign-in)

### Installation

1. **Clone the repository and install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Database - Neon PostgreSQL recommended
DATABASE_URL="postgresql://user:password@localhost:5432/iot_platform?schema=public"

# For Neon DB:
# DATABASE_URL="postgresql://username:password@ep-xxxxx.us-east-1.aws.neon.tech/iot_platform?sslmode=require"

# NextAuth.js Secret - Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

3. **Initialize the database**:
```bash
npx prisma generate
npx prisma db push
```

4. **Run the development server**:
```bash
npm run dev
```

5. **Open the application**:
Visit [http://localhost:3000](http://localhost:3000)

### Creating an Admin User

By default, new users have the `USER` role. To create an admin:

1. Sign up as a normal user
2. Connect to your database and run:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## API Documentation

### Authentication

All API requests (except data upload) require authentication via session cookie.

### Data Upload

**Endpoint**: `POST /api/data/upload`

**Method 1 - Using Channel Write Key**:
```json
{
  "write_api_key": "your_channel_write_key",
  "field1": 25.5,
  "field2": 60.0,
  "field3": 1013.25,
  "field4": 500,
  "status": "ok",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Method 2 - Using User API Key**:
```json
{
  "api_key": "your_user_api_key",
  "channel_id": "your_channel_id",
  "field1": 25.5,
  "field2": 60.0
}
```

**Response**:
```json
{
  "success": true,
  "entry_id": "cl...",
  "channel_id": "cl...",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

### Other Endpoints

- `GET /api/channels` - List user channels
- `POST /api/channels` - Create new channel
- `GET /api/channels/[id]` - Get channel details with data
- `GET /api/channels/[id]/export?format=csv|json` - Export data
- `GET /api/api-keys` - List API keys
- `POST /api/api-keys` - Create new API key
- `GET /api/projects` - List projects library
- `GET /api/stats` - User statistics

## Arduino/ESP32 Example

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* apiKey = "YOUR_WRITE_API_KEY";

void sendData() {
  HTTPClient http;
  http.begin("https://your-domain.com/api/data/upload");
  http.addHeader("Content-Type", "application/json");
  
  String payload = "{";
  payload += "\"write_api_key\":\"" + String(apiKey) + "\",";
  payload += "\"field1\":" + String(readTemperature()) + ",";
  payload += "\"field2\":" + String(readHumidity()) + ",";
  payload += "\"status\":\"ok\"";
  payload += "}";
  
  int response = http.POST(payload);
  http.end();
}
```

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth configuration
│   │   ├── channels/     # Channel CRUD operations
│   │   ├── api-keys/     # API key management
│   │   ├── data/upload/  # Data ingestion endpoint
│   │   ├── projects/     # Projects library
│   │   ├── stats/        # User statistics
│   │   └── admin/        # Admin-only endpoints
│   ├── auth/             # Sign in / Sign up pages
│   ├── dashboard/        # User dashboard
│   │   ├── channels/     # Channel management
│   │   ├── api-keys/     # API key management
│   │   ├── projects/     # Projects library
│   │   └── settings/     # User settings
│   ├── admin/            # Admin panel
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/           # UI components
├── lib/                  # Utilities
│   ├── db.ts            # Prisma client
│   ├── auth.ts          # NextAuth configuration
│   ├── api-keys.ts      # API key utilities
│   ├── channels.ts      # Channel utilities
│   ├── data.ts          # Data point utilities
│   └── projects.ts      # Project utilities
├── prisma/
│   └── schema.prisma    # Database schema
└── public/              # Static assets
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your hosting platform:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## License

MIT License - feel free to use this for personal or commercial projects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
