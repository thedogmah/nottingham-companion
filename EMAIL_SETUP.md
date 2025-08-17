# Email Setup Guide

## Overview
The contact form now sends email notifications to ryanbirks00@gmail.com whenever someone submits an inquiry.

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Email Credentials
You need to set up environment variables for Gmail SMTP:

**Option A: DigitalOcean Environment Variables**
- Go to your DigitalOcean App Platform dashboard
- Navigate to your app's settings
- Add these environment variables:
  - `EMAIL_USER`: Your Gmail address (e.g., ryanbirks00@gmail.com)
  - `EMAIL_PASS`: Your Gmail App Password (NOT your regular password)

**Option B: Local Development**
- Create a `.env` file in the project root
- Add the same variables as above

### 3. Gmail App Password Setup
1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Generate an App Password for "Mail"
4. Use this 16-character password as your `EMAIL_PASS`

### 4. Test the Setup
- Submit a test contact form
- Check your email at ryanbirks00@gmail.com
- Subject should be: "Friendship - New Companion Service Inquiry"

## Email Content
Each email includes:
- All form details (name, email, phone, location, etc.)
- Service type and duration preferences
- The customer's message
- UTM tracking data (if available)
- Inquiry ID and timestamp
- Professional formatting

## Troubleshooting
- Check DigitalOcean logs for email errors
- Verify environment variables are set correctly
- Ensure Gmail App Password is valid
- Check spam folder for test emails

## Security Notes
- Never commit `.env` files to Git
- Use App Passwords, not regular passwords
- Environment variables are encrypted in DigitalOcean
