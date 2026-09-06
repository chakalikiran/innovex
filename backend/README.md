# ClearPass Backend Service

Modular Express.js backend services and API routing for the ClearPass Digital Clearance Platform.

## Directory Structure

```
backend/
├── routes/
│   ├── clearance.ts     # Clearance inquiry & departments API
│   ├── certificates.ts  # Digital certificate verification API
│   └── stats.ts         # University clearance overview statistics
├── types.ts             # Backend TypeScript interfaces and types
├── server.ts            # Express server initialization & API middleware
└── README.md            # Backend documentation
```

## API Endpoints

- `GET /api/health` - Health check and service status
- `GET /api/clearance/departments` - List registered clearance departments and officers
- `GET /api/clearance/status/:id` - Inquire status of an active clearance application
- `GET /api/certificates/verify/:certId` - Cryptographic certificate verification
- `GET /api/stats/overview` - University-wide clearance metrics and turnaround statistics
