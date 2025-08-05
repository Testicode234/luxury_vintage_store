import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';

const ShippingSection = ({ 
  isOpen, 
  onToggle, 
  shippingData, 
  onShippingChange, 
  savedAddresses,
  onAddressSelect,
  deliveryOptions,
  selectedDelivery,
  onDeliveryChange 
}) => {
  const [useExistingAddress, setUseExistingAddress] = useState(false);

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
            1
          </div>
          <h3 className="text-lg font-semibold text-foreground">Shipping Information</h3>
        </div>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-border">
          {/* Saved Addresses */}
          {savedAddresses?.length > 0 && (
            <div className="mb-6">
              <Checkbox
                label="Use saved address"
                checked={useExistingAddress}
                onChange={(e) => setUseExistingAddress(e?.target?.checked)}
                className="mb-4"
              />

              {useExistingAddress && (
                <div className="space-y-3">
                  {savedAddresses?.map((address) => (
                    <div
                      key={address?.id}
                      onClick={() => onAddressSelect(address)}
                      className="p-4 border border-border rounded-lg cursor-pointer hover:border-accent transition-smooth"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{address?.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {address?.street}, {address?.city}, {address?.state} {address?.zipCode}
                          </p>
                          <p className="text-sm text-muted-foreground">{address?.country}</p>
                        </div>
                        <Icon name="Check" size={16} className="text-accent" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Manual Address Entry */}
          {!useExistingAddress && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="Enter first name"
                  value={shippingData?.firstName}
                  onChange={(e) => onShippingChange('firstName', e?.target?.value)}
                  required
                />
                <Input
                  label="Last Name"
                  type="text"
                  placeholder="Enter last name"
                  value={shippingData?.lastName}
                  onChange={(e) => onShippingChange('lastName', e?.target?.value)}
                  required
                />
              </div>

              <Input
                label="Street Address"
                type="text"
                placeholder="Enter street address"
                value={shippingData?.street}
                onChange={(e) => onShippingChange('street', e?.target?.value)}
                required
              />

              <Input
                label="Apartment, suite, etc. (optional)"
                type="text"
                placeholder="Apartment, suite, etc."
                value={shippingData?.apartment}
                onChange={(e) => onShippingChange('apartment', e?.target?.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="City"
                  type="text"
                  placeholder="Enter city"
                  value={shippingData?.city}
                  onChange={(e) => onShippingChange('city', e?.target?.value)}
                  required
                />
                <Select
                  label="State"
                  placeholder="Select state"
                  options={stateOptions}
                  value={shippingData?.state}
                  onChange={(value) => onShippingChange('state', value)}
                />
                <Input
                  label="ZIP Code"
                  type="text"
                  placeholder="Enter ZIP code"
                  value={shippingData?.zipCode}
                  onChange={(e) => onShippingChange('zipCode', e?.target?.value)}
                  required
                />
              </div>

              <Select
                label="Country"
                placeholder="Select country"
                options={countryOptions}
                value={shippingData?.country}
                onChange={(value) => onShippingChange('country', value)}
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="Enter phone number"
                value={shippingData?.phone}
                onChange={(e) => onShippingChange('phone', e?.target?.value)}
                required
              />
            </div>
          )}

          {/* Delivery Options */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-md font-medium text-foreground mb-4">Delivery Options</h4>
            <div className="space-y-3">
              {deliveryOptions?.map((option) => (
                <div
                  key={option?.id}
                  onClick={() => onDeliveryChange(option?.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-smooth ${
                    selectedDelivery === option?.id
                      ? 'border-accent bg-accent/5' :'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedDelivery === option?.id
                          ? 'border-accent bg-accent' :'border-muted-foreground'
                      }`}>
                        {selectedDelivery === option?.id && (
                          <div className="w-full h-full rounded-full bg-accent-foreground scale-50"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{option?.name}</p>
                        <p className="text-sm text-muted-foreground">{option?.description}</p>
                      </div>
                    </div>
                    <p className="font-medium text-foreground">${option?.price?.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingSection;