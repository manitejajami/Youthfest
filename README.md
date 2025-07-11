# Youthfest Registration App

A full-stack event registration system with payment, WhatsApp notifications, college suggestions, and admin panel.

## Features

- User registration with ₹49 payment (Razorpay)
- WhatsApp notifications to registrants (Gupshup)
- MongoDB Atlas for data
- College field with suggestions (typeahead)
- Admin panel: view, delete, filter, export registrations, manage colleges, and see stats
- Vercel-ready frontend, Google Cloud Run-ready backend

## Backend Setup

1. Edit `.env.example` with your secrets. Copy to `.env` (don't commit real secrets!).
2. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
3. Run locally for testing:
   ```sh
   npm start
   ```
4. Deploy to Cloud Run:
   - Build image:
     ```sh
     gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/youthfest-backend
     ```
   - Deploy:
     ```sh
     gcloud run deploy youthfest-backend \
       --image gcr.io/YOUR_PROJECT_ID/youthfest-backend \
       --platform managed \
       --region us-central1 \
       --allow-unauthenticated \
       --set-env-vars PORT=8080,MONGO_URI=...,GUPSHUP_API_KEY=...,GUPSHUP_SOURCE=...,WHATSAPP_GROUP_LINK=...,EVENT_DATE=...,RAZORPAY_KEY_ID=...,RAZORPAY_KEY_SECRET=...,ADMIN_SECRET=...
     ```

## Frontend Setup

1. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
2. Run locally for testing:
   ```sh
   npm start
   ```
3. For Vercel:
   - Push to GitHub
   - Import frontend in Vercel dashboard
   - Set your backend Cloud Run URL in `vercel.json`
   - Add Razorpay key as a Vercel secret if desired

## Admin Panel

- Click “Admin Panel” in the frontend UI.
- Log in with your admin password (`ADMIN_SECRET`).
- Tabs for registrations (filter/export/delete), colleges (add/delete), and stats.

## QR Code

- Generate a QR code to your Vercel frontend URL for easy access.

## Security

- Never commit your `.env` file!
- Use `.env.example` for sharing config formats.

## Support

For help, file issues in this repo or contact the maintainer.