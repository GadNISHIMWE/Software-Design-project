<!DOCTYPE html>
<html>
<head>
    <title>Verification Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .code {
            font-size: 32px;
            font-weight: bold;
            color: #2e7d32;
            text-align: center;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Your Verification Code</h2>
        <p>Please use the following code to verify your account:</p>
        
        <div class="code">{{ $otp }}</div>
        
        <p>This code will expire in 10 minutes.</p>
        
        <p>If you didn't request this code, please ignore this email.</p>
        
        <div class="footer">
            <p>© {{ date('Y') }} Smart Greenhouse Management System</p>
        </div>
    </div>
</body>
</html> 