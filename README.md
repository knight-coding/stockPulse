# StockPulse

StockPulse is a **work-in-progress** full-stack stock portfolio and market-tracking application built with the **MERN stack**.

## 🚧 Development Status

StockPulse is currently **under active development**. The core functionality for managing securities, portfolios, watchlists, and stock-price data has been implemented.

### ✅ Implemented

* Securities master-data management
* Security search functionality
* Portfolio management
* Portfolio holdings management
* Watchlist management
* Required-stock tracking to identify securities that need price updates
* BharatStocks API integration for fetching stock quotes
* BullMQ-based background job processing
* Batch processing of stock symbols to optimize API usage
* Independent BullMQ jobs for each stock batch
* Retry mechanism for failed stock-data batches
* Redis integration for caching the latest EOD stock prices
* Reading cached EOD prices from Redis for watchlist data
* Sequential batch processing to control external API requests and conserve API quota

### 🔨 Under Implementation

The following features and improvements are currently being worked on:

* **Automatic EOD Scheduler**

  * Automatically trigger the stock-price update process after the market closes.
  * The scheduler will enqueue the `prepare-stock-update` job, which will then create the required stock-batch jobs.

* **Aggregated Portfolio Data**

    * Aggregate holdings and portfolio data across multiple brokers.
    * Provide users with a consolidated view of their overall investments.

* **Required Stock Cleanup**

  * Remove securities from the `RequiredStock` collection when they are no longer required by any portfolio or watchlist.

* **EOD Data Reliability Improvements**

  * Add handling for stale or unavailable cached prices.
  * Improve error handling for external API and Redis failures.

* **Further Performance and Reliability Improvements**

  * Optimize background processing and database operations.
  * Improve handling of edge cases and concurrent updates.

The project will continue to be expanded with additional features and improvements as development progresses.


## Tech Stack

### Frontend
- React.js
- JavaScript
- Tailwind CSS
- React Hooks
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Redis
- JWT Authentication

### External Services
- BharatStocksAPI for stock market data
- Cloudinary (if enabled for media/file uploads)

---

## Project Status

**Status: 🚧 In Progress**

### Implemented so far

- MERN stack application structure
- NSE securities data insertion and management
- Security search and validation
- Stock-data fetching through the external market-data API
- Redis integration
- Stock-price caching strategy
- Portfolio-related backend groundwork
- Watchlist-related backend groundwork

### Currently being developed

- Complete portfolio functionality
- Complete watchlist functionality
- End-of-day stock-price workflow
- Dashboard and portfolio analytics
- Additional stock-market features

### Planned / Future Work

- BullMQ and background workers
- Price alerts
- Advanced portfolio analytics
- Additional market-data integrations
- Production monitoring and optimization

> The README describes both implemented functionality and planned functionality. Features under **Implemented so far** are currently part of the project; items under **Planned / Future Work** have not necessarily been implemented yet.

---

## Features

- User authentication and authorization
- Stock/security search
- NSE securities master-data management
- Portfolio management
- Add/remove stocks from watchlist
- End-of-day stock price tracking
- Redis caching to reduce repeated API requests
- Background jobs using BullMQ
- RESTful backend APIs
- MongoDB-based persistent storage
- Responsive React frontend

---

## Project Structure

```text
StockPulse/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── scripts/
│   │   └── insertNseSequrities.js
│   ├── config/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

> The exact folder structure may vary depending on the current implementation.

---

# Getting Started

## Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/)
- MongoDB
- Redis
- Git
- npm

You will also need API credentials for the external stock-data provider if the application requires them.

---

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd StockPulse
```

---

## 2. Install Dependencies

Install dependencies for both the backend and frontend.

### Backend

```bash
cd backend
npm install
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
```

---

# 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

REDIS_URL=your_redis_connection_string

BHARAT_STOCKS_API_KEY=your_api_key

CLIENT_URL=http://localhost:5173
```

Create a `.env` file inside the `frontend` directory if your frontend requires environment-specific configuration.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

> Do not commit `.env` files or API keys to the repository.

---

# 4. Insert NSE Securities Data

**This step must be completed before starting the frontend and backend.**

StockPulse uses NSE securities data for security lookup and stock validation. Populate the securities collection using the provided script:

```bash
cd backend
node scripts/insertNseSequrities
```

If the script requires a file extension in your environment, use:

```bash
node scripts/insertNseSequrities.js
```

This will insert the NSE securities/master data into MongoDB.

### Why is this required?

The application uses the securities dataset for:

- Stock/security search
- Symbol validation
- Company-name lookup
- Portfolio stock validation
- Watchlist stock validation

Without this data, security search and stock-related features may not work correctly.

---

# 5. Start Redis

StockPulse uses Redis for caching and background-job related functionality.

If Redis is running locally:

```bash
redis-server
```

If you are using Docker:

```bash
docker run -d --name stockpulse-redis -p 6379:6379 redis
```

Make sure the Redis connection URL in your backend environment variables matches your setup.

---

# 6. Start the Backend

From the `backend` directory:

```bash
npm run dev
```

Or, depending on the scripts defined in `package.json`:

```bash
npm start
```

The backend will typically run on:

```text
http://localhost:5000
```

---

# 7. Start the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend will typically be available at:

```text
http://localhost:5173
```

---

# Complete Local Setup Flow

For a fresh setup, follow this order:

```text
1. Clone repository
        ↓
2. Install backend dependencies
        ↓
3. Install frontend dependencies
        ↓
4. Configure environment variables
        ↓
5. Start MongoDB
        ↓
6. Start Redis
        ↓
7. Run NSE securities insertion script
        ↓
8. Start backend
        ↓
9. Start frontend
```

The important initialization command is:

```bash
node scripts/insertNseSequrities
```

Run it from the `backend` directory **before starting the application**.

---

# Stock Data Flow

StockPulse is designed to minimize unnecessary requests to the external stock-data API.

A simplified flow is:

```text
User
 │
 ▼
React Frontend
 │
 ▼
Express REST API
 │
 ├──────────────► MongoDB
 │
 └──────────────► Redis
                     │
                     ▼
              Cached Stock Data
```

For end-of-day prices:

```text
Market Closes
      │
      ▼
Backend Job / Service
      │
      ▼
Check Required Unique Stocks
      │
      ▼
BharatStocksAPI
      │
      ▼
Store / Cache Closing Prices
      │
      ▼
Redis / MongoDB
      │
      ▼
Dashboard
```

The application can reuse a stock's cached closing price instead of requesting the same data repeatedly for every user.

---

# Portfolio

Users can add stocks to their portfolio.

Before adding a security, the backend can validate the requested symbol against the securities dataset.

Example conceptual flow:

```text
User enters stock
       ↓
Search / Validate Symbol
       ↓
Check NSE Securities
       ↓
Valid Security?
    /       \
  Yes        No
   ↓          ↓
Add holding   Reject
```

---

# Watchlist

Users can maintain a personal watchlist.

Current watchlist operations include:

- Add a stock to watchlist
- Get user's watchlist
- Remove a stock from watchlist

The watchlist can store security identifiers such as the **symbol/ISIN** in the user's profile rather than duplicating complete security information.

Conceptually:

```text
User
 │
 ├── Portfolio
 │
 └── Watchlist
       ├── RELIANCE
       ├── TCS
       └── INFY
```

Security metadata remains in the central securities collection.

---

# Security Search

StockPulse supports searching securities by fields such as:

- Ticker symbol
- Company name

The search logic can prioritize:

1. Exact symbol matches
2. Symbol prefix matches
3. Company-name matches
4. Active securities

This provides a faster and more relevant stock-selection experience.

---

# API Design

The backend follows a REST API architecture.

Typical API areas include:

```text
/api/auth
/api/users
/api/securities
/api/portfolio
/api/watchlist
/api/stocks
```

Example security search:

```http
GET /api/securities/search?q=reliance
```

Example watchlist operations:

```http
GET    /api/watchlist
POST   /api/watchlist
DELETE /api/watchlist/:symbol
```

> Exact routes may differ from the current implementation.

---

# Database

MongoDB is used as the primary application database.

A security document contains information such as:

```text
symbol
companyName
series
listingDate
paidUpValue
marketLot
isin
faceValue
exchange
isActive
```

User-specific data such as portfolio and watchlist information is associated with the user account.

---

# Redis

Redis is used for fast, temporary, or frequently accessed data.

Potential StockPulse use cases include:

- Stock-price caching
- Temporary OTP data
- Reducing repeated external API requests

The application can keep different Redis concerns logically separated through different key prefixes.

Example:

```text
stock:price:RELIANCE
stock:price:TCS

otp:user:<id>
```

---

# API Quota Considerations

StockPulse is designed with external API limits in mind.

Instead of requesting a stock's closing price independently for every user, the application can:

1. Maintain a unique set of required stocks.
2. Fetch each required stock once.
3. Cache/store the result.
4. Reuse the result for all users holding or watching that stock.

For example:

```text
100 users
   │
   ├── RELIANCE ──┐
   ├── RELIANCE ──┤
   ├── TCS ───────┤
   ├── TCS ───────┤
   └── INFY ──────┘
                  │
                  ▼
       Unique stocks = 3
                  │
                  ▼
       Fetch only required symbols
```

This is especially important when operating under a daily API request quota. The current implementation focuses on fetching and caching stock data efficiently; background workers are planned for a later stage.

---

# Development

Run backend and frontend in separate terminals.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

For a new database/setup, make sure the NSE securities initialization has already been executed:

```bash
cd backend
node scripts/insertNseSequrities
```

---

# Environment & Security

Never commit the following to Git:

```text
.env
API keys
JWT secrets
Database credentials
Redis credentials
Cloudinary credentials
```

Add them to `.gitignore`:

```gitignore
node_modules/
.env
.env.*
dist/
build/
```

---

# Future Improvements

Potential future additions include:

- Real-time/intraday price updates
- Advanced portfolio analytics
- Profit & loss calculations
- Sector allocation
- Portfolio performance charts
- Price alerts
- News integration
- More exchanges and securities
- Advanced caching strategies
- Rate-limit handling and retry mechanisms
- Production monitoring and logging

---

# License

This project is currently intended for educational, development, and portfolio purposes.

Add the appropriate license here if the project is released under an open-source license.

---

## Author

**Manan Sehgal**

StockPulse — Stock portfolio and market tracking application built with the MERN stack.
