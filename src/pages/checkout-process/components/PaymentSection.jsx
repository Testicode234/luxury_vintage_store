import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';


const PaymentSection = ({ 
  isOpen, 
  onToggle, 
  paymentData, 
  onPaymentChange,
  paymentMethod,
  onPaymentMethodChange 
}) => {
  const [cardErrors, setCardErrors] = useState({});

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'CreditCard' },
    { id: 'paypal', name: 'PayPal', icon: 'Wallet' },
    { id: 'apple', name: 'Apple Pay', icon: 'Smartphone' }
  ];

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1)?.padStart(2, '0'),
    label: String(i + 1)?.padStart(2, '0')
  }));

  const currentYear = new Date()?.getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    value: String(currentYear + i),
    label: String(currentYear + i)
  }));

  const validateCard = (field, value) => {
    const errors = { ...cardErrors };
    
    switch (field) {
      case 'cardNumber':
        if (!/^\d{16}$/?.test(value?.replace(/\s/g, ''))) {
          errors.cardNumber = 'Card number must be 16 digits';
        } else {
          delete errors?.cardNumber;
        }
        break;
      case 'cvv':
        if (!/^\d{3,4}$/?.test(value)) {
          errors.cvv = 'CVV must be 3-4 digits';
        } else {
          delete errors?.cvv;
        }
        break;
      default:
        break;
    }
    
    setCardErrors(errors);
  };

  const formatCardNumber = (value) => {
    const v = value?.replace(/\s+/g, '')?.replace(/[^0-9]/gi, '');
    const matches = v?.match(/\d{4,16}/g);
    const match = matches && matches?.[0] || '';
    const parts = [];
    for (let i = 0, len = match?.length; i < len; i += 4) {
      parts?.push(match?.substring(i, i + 4));
    }
    if (parts?.length) {
      return parts?.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-smooth"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-accent text-accent-foreground rounded-full text-sm font-medium">
            3
          </div>
          <h3 className="text-lg font-semibold text-foreground">Payment Method</h3>
        </div>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-border">
          {/* Payment Method Selection */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-foreground mb-4">Select Payment Method</h4>
            <div className="space-y-3">
              {paymentMethods?.map((method) => (
                <div
                  key={method?.id}
                  onClick={() => onPaymentMethodChange(method?.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-smooth ${
                    paymentMethod === method?.id
                      ? 'border-accent bg-accent/5' :'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      paymentMethod === method?.id
                        ? 'border-accent bg-accent' :'border-muted-foreground'
                    }`}>
                      {paymentMethod === method?.id && (
                        <div className="w-full h-full rounded-full bg-accent-foreground scale-50"></div>
                      )}
                    </div>
                    <Icon name={method?.icon} size={20} className="text-muted-foreground" />
                    <span className="font-medium text-foreground">{method?.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <Input
                label="Card Number"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentData?.cardNumber}
                onChange={(e) => {
                  const formatted = formatCardNumber(e?.target?.value);
                  onPaymentChange('cardNumber', formatted);
                  validateCard('cardNumber', formatted);
                }}
                error={cardErrors?.cardNumber}
                maxLength={19}
                required
              />

              <Input
                label="Cardholder Name"
                type="text"
                placeholder="Enter name on card"
                value={paymentData?.cardName}
                onChange={(e) => onPaymentChange('cardName', e?.target?.value)}
                required
              />

              <div className="grid grid-cols-3 gap-4">
                <Select
                  label="Month"
                  placeholder="MM"
                  options={monthOptions}
                  value={paymentData?.expiryMonth}
                  onChange={(value) => onPaymentChange('expiryMonth', value)}
                />
                <Select
                  label="Year"
                  placeholder="YYYY"
                  options={yearOptions}
                  value={paymentData?.expiryYear}
                  onChange={(value) => onPaymentChange('expiryYear', value)}
                />
                <Input
                  label="CVV"
                  type="text"
                  placeholder="123"
                  value={paymentData?.cvv}
                  onChange={(e) => {
                    const value = e?.target?.value?.replace(/\D/g, '');
                    onPaymentChange('cvv', value);
                    validateCard('cvv', value);
                  }}
                  error={cardErrors?.cvv}
                  maxLength={4}
                  required
                />
              </div>
            </div>
          )}

          {/* PayPal */}
          {paymentMethod === 'paypal' && (
            <div className="p-6 bg-muted/30 border border-border rounded-lg text-center">
              <Icon name="Wallet" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">PayPal Payment</p>
              <p className="text-sm text-muted-foreground">
                You will be redirected to PayPal to complete your payment securely.
              </p>
            </div>
          )}

          {/* Apple Pay */}
          {paymentMethod === 'apple' && (
            <div className="p-6 bg-muted/30 border border-border rounded-lg text-center">
              <Icon name="Smartphone" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">Apple Pay</p>
              <p className="text-sm text-muted-foreground">
                Use Touch ID or Face ID to pay with your default card.
              </p>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-muted/20 border border-border rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Shield" size={20} className="text-accent mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Secure Payment</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;