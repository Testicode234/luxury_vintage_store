import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import  Checkbox from '../../../components/ui/Checkbox';

const BillingSection = ({ 
  isOpen, 
  onToggle, 
  billingData, 
  onBillingChange,
  shippingData,
  sameAsShipping,
  onSameAsShippingChange 
}) => {
  const countryOptions = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' }
  ];

  const stateOptions = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-smooth"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-accent text-accent-foreground rounded-full text-sm font-medium">
            2
          </div>
          <h3 className="text-lg font-semibold text-foreground">Billing Information</h3>
        </div>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="mb-6">
            <Checkbox
              label="Same as shipping address"
              checked={sameAsShipping}
              onChange={(e) => onSameAsShippingChange(e?.target?.checked)}
            />
          </div>

          {!sameAsShipping && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="Enter first name"
                  value={billingData?.firstName}
                  onChange={(e) => onBillingChange('firstName', e?.target?.value)}
                  required
                />
                <Input
                  label="Last Name"
                  type="text"
                  placeholder="Enter last name"
                  value={billingData?.lastName}
                  onChange={(e) => onBillingChange('lastName', e?.target?.value)}
                  required
                />
              </div>

              <Input
                label="Street Address"
                type="text"
                placeholder="Enter street address"
                value={billingData?.street}
                onChange={(e) => onBillingChange('street', e?.target?.value)}
                required
              />

              <Input
                label="Apartment, suite, etc. (optional)"
                type="text"
                placeholder="Apartment, suite, etc."
                value={billingData?.apartment}
                onChange={(e) => onBillingChange('apartment', e?.target?.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="City"
                  type="text"
                  placeholder="Enter city"
                  value={billingData?.city}
                  onChange={(e) => onBillingChange('city', e?.target?.value)}
                  required
                />
                <Select
                  label="State"
                  placeholder="Select state"
                  options={stateOptions}
                  value={billingData?.state}
                  onChange={(value) => onBillingChange('state', value)}
                />
                <Input
                  label="ZIP Code"
                  type="text"
                  placeholder="Enter ZIP code"
                  value={billingData?.zipCode}
                  onChange={(e) => onBillingChange('zipCode', e?.target?.value)}
                  required
                />
              </div>

              <Select
                label="Country"
                placeholder="Select country"
                options={countryOptions}
                value={billingData?.country}
                onChange={(value) => onBillingChange('country', value)}
              />
            </div>
          )}

          {sameAsShipping && (
            <div className="p-4 bg-muted/30 border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Billing address will be:</p>
              <div className="text-sm text-foreground">
                <p>{shippingData?.firstName} {shippingData?.lastName}</p>
                <p>{shippingData?.street}</p>
                {shippingData?.apartment && <p>{shippingData?.apartment}</p>}
                <p>{shippingData?.city}, {shippingData?.state} {shippingData?.zipCode}</p>
                <p>{shippingData?.country}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BillingSection;