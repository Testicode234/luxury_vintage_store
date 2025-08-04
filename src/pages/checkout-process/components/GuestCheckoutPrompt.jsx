import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Link } from 'react-router-dom';

const GuestCheckoutPrompt = ({ isGuest, onToggleGuest }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-start space-x-4">
        <Icon name="User" size={24} className="text-muted-foreground mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">Account Options</h3>
          
          {isGuest ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                You're checking out as a guest. Create an account to track your orders and save your information for faster checkout.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={onToggleGuest}
                  iconName="UserPlus"
                  iconPosition="left"
                >
                  Create Account
                </Button>
                <Link to="/user-authentication">
                  <Button
                    variant="ghost"
                    iconName="LogIn"
                    iconPosition="left"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Create an account to save your information and track your orders.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={onToggleGuest}
                  iconName="UserX"
                  iconPosition="left"
                >
                  Continue as Guest
                </Button>
                <Link to="/user-authentication">
                  <Button
                    variant="ghost"
                    iconName="LogIn"
                    iconPosition="left"
                  >
                    Sign In Instead
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestCheckoutPrompt;