# OTP Verification Process

In a real application, the OTP verification would work as follows:

1. When a user signs up or requests verification, the backend would:
   - Generate a random 6-digit code
   - Send this code to the user's email or phone number
   - Store this code (hashed) in the database with an expiration time

2. The frontend would:
   - Redirect the user to the verification page
   - Allow the user to enter the code they received
   - Submit the code to the backend for verification

3. The backend would then:
   - Verify the submitted code against the stored code
   - Check if the code is still valid (not expired)
   - If valid, mark the user as verified and allow them to proceed
   - If invalid, show an error message

For this demo application, we're simulating this process. In a production environment, you would need to:

1. Set up an email service (like SendGrid, Mailgun, etc.) or SMS service (like Twilio)
2. Implement the backend logic to generate, store, and verify codes
3. Set up proper error handling and security measures

The "Resend" functionality would trigger a new code generation and sending process.
