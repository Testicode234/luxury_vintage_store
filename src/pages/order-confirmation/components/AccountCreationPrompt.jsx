import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const AccountCreationPrompt = ({ email, orderNumber, onCreateAccount }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleCreateAccount = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsCreating(true);
    try {
      await onCreateAccount({ email, password, orderNumber });
      navigate('/user-authentication?created=true');
    } catch (error) {
      setErrors({ general: 'Failed to create account. Please try again.' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSignIn = () => {
    navigate('/user-authentication');
  };

  if (showForm) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="UserPlus" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Create Your Account</h3>
            <p className="text-sm text-muted-foreground">Save your order history and track future purchases</p>
          </div>
        </div>
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            disabled
            className="opacity-60"
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="Create a secure password"
            value={password}
            onChange={(e) => setPassword(e?.target?.value)}
            error={errors?.password}
            required
          />
          
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e?.target?.value)}
            error={errors?.confirmPassword}
            required
          />

          {errors?.general && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              {errors?.general}
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              type="submit"
              loading={isCreating}
              iconName="UserPlus"
              iconPosition="left"
              className="flex-1"
            >
              Create Account
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="UserPlus" size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Save Your Order History</h3>
          <p className="text-sm text-muted-foreground">Create an account to track this order and manage future purchases</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => setShowForm(true)}
          iconName="UserPlus"
          iconPosition="left"
          className="flex-1"
        >
          Create Account
        </Button>
        <Button
          variant="outline"
          onClick={handleSignIn}
          iconName="LogIn"
          iconPosition="left"
          className="flex-1"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default AccountCreationPrompt;