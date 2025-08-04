import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmailConfirmation = ({ email, onResendEmail }) => {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await onResendEmail();
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to resend email:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="Mail" size={20} className="text-accent" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Email Confirmation Sent
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            We've sent a confirmation email to <span className="text-foreground font-medium">{email}</span> with your order details and tracking information.
          </p>
          
          {resendSuccess ? (
            <div className="flex items-center space-x-2 text-success">
              <Icon name="Check" size={16} />
              <span className="text-sm">Email sent successfully!</span>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendEmail}
                loading={isResending}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Resend Email
              </Button>
              <span className="text-xs text-muted-foreground">
                Didn't receive it? Check your spam folder.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;