import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderTracking = ({ currentStatus, trackingNumber, estimatedSteps }) => {
  const getStatusIcon = (status, isActive, isCompleted) => {
    if (isCompleted) {
      return <Icon name="Check" size={16} className="text-success-foreground" />;
    }
    if (isActive) {
      return <Icon name="Clock" size={16} className="text-accent-foreground" />;
    }
    return <Icon name="Circle" size={16} className="text-muted-foreground" />;
  };

  const getStatusColor = (isActive, isCompleted) => {
    if (isCompleted) return 'bg-success';
    if (isActive) return 'bg-accent';
    return 'bg-muted';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Order Tracking</h2>
        {trackingNumber && (
          <div className="text-sm">
            <span className="text-muted-foreground">Tracking: </span>
            <span className="text-foreground font-medium">{trackingNumber}</span>
          </div>
        )}
      </div>
      {/* Tracking Timeline */}
      <div className="space-y-4">
        {estimatedSteps?.map((step, index) => {
          const isCompleted = step?.status === 'completed';
          const isActive = step?.status === 'active';
          const isLast = index === estimatedSteps?.length - 1;

          return (
            <div key={step?.id} className="flex items-start space-x-4">
              {/* Status Icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusColor(isActive, isCompleted)}`}>
                {getStatusIcon(step?.status, isActive, isCompleted)}
              </div>
              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-medium ${isCompleted || isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step?.title}
                  </h3>
                  {step?.date && (
                    <span className="text-xs text-muted-foreground">
                      {step?.date}
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-1 ${isCompleted || isActive ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                  {step?.description}
                </p>
                {step?.estimatedDate && !step?.date && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Estimated: {step?.estimatedDate}
                  </p>
                )}
              </div>
              {/* Connecting Line */}
              {!isLast && (
                <div className="absolute left-[31px] mt-8 w-0.5 h-6 bg-border"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracking;