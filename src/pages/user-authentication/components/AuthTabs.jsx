import React from 'react';
import Button from '../../../components/ui/Button';

const AuthTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex bg-card rounded-lg p-1 mb-8">
      <Button
        variant={activeTab === 'login' ? 'default' : 'ghost'}
        onClick={() => onTabChange('login')}
        className={`flex-1 ${activeTab === 'login' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      >
        Sign In
      </Button>
      <Button
        variant={activeTab === 'register' ? 'default' : 'ghost'}
        onClick={() => onTabChange('register')}
        className={`flex-1 ${activeTab === 'register' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      >
        Create Account
      </Button>
    </div>
  );
};

export default AuthTabs;