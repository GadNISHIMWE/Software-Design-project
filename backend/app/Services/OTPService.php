<?php

namespace App\Services;

use App\Models\User;
use App\Models\OTP;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\OTPMail;
use Illuminate\Support\Facades\Log;

class OTPService
{
    public function generateOTP(User $user): string
    {
        // Log at the very beginning of the function
        Log::info('Entering generateOTP function for user: ' . $user->id);

        // Delete any existing unused OTPs
        $user->otps()->where('is_used', false)->delete();

        // Generate a new OTP
        $otp = Str::random(6);
        Log::info('Generated OTP: ' . $otp);

        // Store the OTP
        $user->otps()->create([
            'code' => $otp,
            'expires_at' => now()->addMinutes(10),
            'is_used' => false
        ]);

        // Log before attempting to send email (from AuthController context)
        // Log::info('User email before sending OTP: ' . $user->email);

        // Log the user's email directly before the mailer call
        Log::info('Email address being passed to mailer: ' . $user->email);

        try {
            // Send OTP via email
            // Explicitly cast email to string before sending
            $email = (string) $user->email;
            
            Mail::to($email)->send(new OTPMail($otp));

            // Log successful email send attempt
            Log::info('OTP email sent successfully to: ' . $email);

        } catch (\Exception $e) {
            // Log any exception during email sending
            Log::error('Failed to send OTP email to ' . $email . ': ' . $e->getMessage());
            // Re-throw the exception so it's caught by the controller
            throw $e;
        }

        return $otp;
    }

    public function verifyOTP(User $user, string $otp): bool
    {
        $latestOTP = $user->getLatestOTP();

        if (!$latestOTP || $latestOTP->code !== $otp) {
            return false;
        }

        // Mark OTP as used
        $latestOTP->update(['is_used' => true]);

        return true;
    }
} 