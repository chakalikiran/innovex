# ClearPass Frontend Application

React 19 + TypeScript + Tailwind CSS client application for the ClearPass Digital Clearance Platform.

## Directory Structure

```
frontend/
└── src/
    ├── assets/          # Static imagery and visual assets
    ├── components/      # React components
    │   ├── authority/   # Department officer & clearance management portal
    │   ├── ApplyClearanceModal.tsx
    │   ├── DigitalCertificateView.tsx
    │   ├── LandingPage.tsx
    │   ├── Navbar.tsx
    │   ├── StudentDashboard.tsx
    │   ├── StudentLandingPage.tsx
    │   └── StudentSignInModal.tsx
    ├── context/         # AuthContext and state providers
    ├── firebase/        # Firebase client configuration and Firestore services
    ├── types.ts         # Shared TypeScript domain models
    ├── App.tsx          # Main application orchestrator
    ├── index.css        # Global Tailwind CSS styling
    └── main.tsx         # Application DOM mount point
```
