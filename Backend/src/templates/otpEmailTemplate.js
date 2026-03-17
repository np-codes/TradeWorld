function OTPEmailTemplate(otpCode) {
    return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Code</title>
            <style>
                /* General styles and resets for email compatibility */
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f7f9fc;
                    color: #233259;
                }

                .email-container {
                    max-width: 560px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    padding: 32px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .header {
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    text-align: center;
                }

                .content-text {
                    font-size: 16px;
                    line-height: 1.5;
                    margin-bottom: 20px;
                }

                .otp-code {
                    display: block;
                    width: fit-content;
                    margin: 0 auto 20px auto;
                    padding: 16px 24px;
                    background: #f2f3f5;
                    font-size: 28px;
                    font-weight: 700;
                    text-align: center;
                    border-radius: 4px;
                    letter-spacing: 2px;
                }

                .footer-text {
                    font-size: 14px;
                    color: #5a6582;
                    text-align: center;
                    margin-top: 20px;
                }

                .security-tip {
                    font-size: 14px;
                    color: #5a6582;
                    margin-top: 20px;
                    padding-top: 10px;
                    border-top: 1px solid #eee;
                    text-align: center;
                }
            </style>
        </head>

        <body>
            <div class="email-container">
                <div class="header">Verify Your Account</div>
                <p class="content-text">
                    Hi,
                    <br><br>
                    You've requested a verification code to access your account. Please use the following code to complete your
                    verification:
                </p>
                <div class="otp-code">${otpCode}</div>
                <p class="content-text">
                    This code expires in 5 minutes. If you didn't request this code, please ignore this email.
                </p>
                <p class="security-tip">
                    Security tip: Never share this code with anyone, including our staff.
                </p>
                <div class="footer-text">
                    Best regards,<br>
                    TradeWorld Team
                </div>
            </div>
        </body>

        </html>
    `
}

module.exports = OTPEmailTemplate;