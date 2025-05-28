<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\OTPMail;

class TestEmail extends Command
{
    protected $signature = 'email:test {email}';
    protected $description = 'Test email configuration by sending a test OTP';

    public function handle()
    {
        $email = $this->argument('email');
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        try {
            Mail::to($email)->send(new OTPMail($otp));
            $this->info('Test email sent successfully!');
            $this->info('OTP: ' . $otp);
        } catch (\Exception $e) {
            $this->error('Failed to send test email: ' . $e->getMessage());
        }
    }
} 