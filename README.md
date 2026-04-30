# NEXUSPAY - Enterprise FinTech Microservices Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Nx](https://img.shields.io/badge/Nx-143055?logo=nx&logoColor=white)](https://nx.dev/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?logo=docker&logoColor=white)](https://docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?logo=redis&logoColor=white)](https://redis.io/)
[![Kafka](https://img.shields.io/badge/Apache%20Kafka-000?style=for-the-badge&logo=apachekafka)](https://kafka.apache.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)

> 🚧 **Status: Active Development** — Core microservices implemented. KYC workflow, payment gateway integration, and e2e test coverage in progress. Target completion: Q3 2026.

**Ultra-scalable event-driven fintech transaction platform** designed for 10,000+ TPS with enterprise-grade microservices architecture, demonstrating senior backend engineering capabilities.

## 🚀 Overview

NEXUSPAY is a production-ready fintech platform built with modern microservices architecture, showcasing enterprise-level design patterns and scalability. This project demonstrates expertise in distributed systems, event-driven architecture, and high-performance transaction processing.

### Key Features

- **10,000+ TPS Transaction Processing** - Built for high-volume financial operations
- **Event-Driven Architecture** - Asynchronous communication with Kafka and RabbitMQ
- **Microservices Design** - Independent, scalable services with clear boundaries
- **Enterprise Security** - JWT authentication, rate limiting, and data protection
- **Production Ready** - Docker orchestration, monitoring, and CI/CD pipelines
- **Type-Safe Development** - Full TypeScript implementation with strict typing

## 🏗️ Architecture

### Microservices Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │────│   User Service  │────│  Wallet Service │
│                 │    │                 │    │                 │
│ • Authentication │    │ • User Mgmt    │    │ • Balance Mgmt  │
│ • Rate Limiting │    │ • KYC Process  │    │ • Transactions  │
│ • Request Routing│    │ • Profiles     │    │ • Transfers    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐    ┌─────────────────┐
                    │Transaction Svc │────│ Notification Svc│
                    │                 │    │                 │
                    │ • Payment Proc │    │ • Email/SMS     │
                    │ • Fraud Detect │    │ • Templates     │
                    │ • Settlement   │    │ • Webhooks      │
                    └─────────────────┘    └─────────────────┘
                             │
                    ┌─────────────────┐    ┌─────────────────┐
                    │ Analytics Svc  │────│ Payment Gateway │
                    │                 │    │                 │
                    │ • Reporting    │    │ • PSP Integration│
                    │ • Metrics      │    │ • Tokenization  │
                    │ • Dashboards   │    │ • PCI Compliance│
                    └─────────────────┘    └─────────────────┘
```

### Architecture Decisions

| Concern | Solution | Why |
|---|---|---|
| Distributed transactions | RabbitMQ + Saga pattern | Avoids 2PC, ensures eventual consistency |
| Real-time analytics | Kafka event streaming | High-throughput, replay-capable audit trail |
| Caching & locks | Redis | Sub-millisecond latency, distributed lock primitives |
| Service isolation | Nx monorepo, separate DBs per service | Independent deployability, no shared state |
| Code structure | Clean/Hexagonal Architecture + DDD | Loose coupling, testability, domain clarity |

### Technology Stack

#### Core Framework & Build Tools
- **NestJS** - Progressive Node.js framework for scalable server applications
- **Nx** - Smart monorepo build system for enterprise-scale development
- **TypeScript** - Type-safe development with advanced language features
- **Node.js** - Runtime environment optimized for microservices

#### Data & Storage
- **PostgreSQL** - Primary database with connection pooling
- **Redis** - High-performance caching and session management
- **TypeORM** - Type-safe ORM with migration support

#### Message Queue & Event Streaming
- **Apache Kafka** - Event streaming platform for high-throughput messaging
- **RabbitMQ** - Message broker for reliable inter-service communication

#### Infrastructure & DevOps
- **Docker & Docker Compose** - Container orchestration and development environment
- **Jest** - Comprehensive testing framework with coverage reporting
- **ESLint & Prettier** - Code quality and formatting standards
- **GitHub Actions** - CI/CD pipeline with automated testing and deployment

#### Security & Monitoring
- **JWT Authentication** - Stateless authentication with refresh tokens
- **Helmet** - Security headers and XSS protection
- **Rate Limiting** - DDoS protection and API throttling
- **Winston Logging** - Structured logging with multiple transports

## 📁 Project Structure

```
nexuspay/
├── apps/                          # Microservices applications
│   ├── api-gateway/              # API Gateway service
│   ├── user-service/             # User management microservice
│   ├── wallet-service/            # Wallet and balance management
│   ├── transaction-service/       # Transaction processing
│   ├── notification-service/      # Notification handling
│   ├── analytics-service/         # Analytics and reporting
│   └── payment-gateway/           # Payment processor integration
├── libs/                          # Shared libraries
│   ├── common/                   # Common utilities and types
│   ├── database/                 # Database configuration and entities
│   ├── auth/                     # Authentication and authorization
│   ├── logger/                   # Logging utilities
│   ├── messaging/                # Message queue abstractions
│   └── validation/               # Input validation schemas
├── tools/                         # Development tools and scripts
├── docker-compose.yml            # Infrastructure orchestration
├── nx.json                       # Nx workspace configuration
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ with npm
- **Docker** and Docker Compose
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nexuspay
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start infrastructure**
   ```bash
   npm run docker:up
   ```

4. **Run the application**
   ```bash
   # Development mode with hot reload
   npm run start:dev

   # Production build
   npm run build:all
   npm run start:prod
   ```

### Environment Setup

Copy the environment template and configure your settings:

```bash
cp .env.example .env
```

Key environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection URL
- `JWT_SECRET` - JWT signing secret
- `KAFKA_BROKERS` - Kafka broker addresses

## 🧪 Testing

Run comprehensive test suites:

```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:cov

# End-to-end tests
npm run test:e2e

# All tests
npm run ci
```

## 🐳 Docker Development

### Start all services
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f api-gateway
```

### Stop services
```bash
docker-compose down
```

## 📊 Monitoring & Observability

- **Health Checks** - `/health` endpoint for service monitoring
- **Metrics** - Prometheus-compatible metrics export
- **Logging** - Structured JSON logging with Winston
- **Tracing** - Distributed tracing with correlation IDs

## 🔒 Security Features

- **JWT Authentication** with refresh token rotation
- **Rate Limiting** to prevent abuse
- **Input Validation** with class-validator
- **SQL Injection Protection** via parameterized queries
- **XSS Protection** with Helmet security headers
- **CORS Configuration** for cross-origin requests

## 🚀 Deployment

### CI/CD Pipeline

GitHub Actions workflow includes:
- Automated testing on every push
- Code quality checks (ESLint, Prettier)
- Security vulnerability scanning
- Docker image building and publishing
- Deployment to staging/production environments

### Production Considerations

- **Horizontal Scaling** - Services designed for Kubernetes deployment
- **Database Sharding** - Support for multi-tenant architectures
- **Caching Strategy** - Redis clusters for high availability
- **Message Queue Clustering** - Kafka and RabbitMQ clustering
- **Load Balancing** - Nginx or AWS ALB for traffic distribution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

API documentation is available via Swagger UI at `/api/docs` when the API Gateway is running.

### Key Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | User authentication |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/users/profile` | User profile management |
| POST | `/kyc/submit` | Submit KYC documents |
| POST | `/wallets/transfer` | Money transfers |
| GET | `/transactions` | Transaction history |
| POST | `/payments/process` | Payment processing |

## 🏆 Skills Demonstrated

This project showcases expertise in:

- **Microservices Architecture** - Service decomposition and communication patterns
- **Event-Driven Design** - Asynchronous processing with message queues
- **Database Design** - Normalized schemas with TypeORM
- **API Design** - RESTful APIs with OpenAPI specification
- **Security Implementation** - Authentication, authorization, and data protection
- **DevOps Practices** - Containerization, CI/CD, and infrastructure as code
- **Testing Strategies** - Unit, integration, and end-to-end testing
- **Performance Optimization** - Caching, connection pooling, and query optimization
- **Code Quality** - TypeScript, linting, formatting, and documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Uman Mushtaq** - Mid-Level Backend Engineer

- 📍 Paris, France (APS Visa — authorized to work in France & EU)
- 💼 LinkedIn: https://www.linkedin.com/in/umanmushtaq/
- 📧 Email: umanmushtaq72@gmail.com
- 🐙 GitHub: https://github.com/UmanMushtaq

---

*Built with ❤️ using NestJS, Nx, and modern enterprise architecture patterns.*