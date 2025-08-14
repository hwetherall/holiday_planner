import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  totalSteps, 
  stepNames 
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step indicator */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </div>
        <div className="text-sm text-gray-500">
          {Math.round(progress)}% Complete
        </div>
      </div>
      
      {/* Step names */}
      <div className="flex justify-between text-xs text-gray-500">
        {stepNames.map((name, index) => (
          <div 
            key={index}
            className={`flex-1 text-center ${
              index < currentStep - 1 
                ? 'text-green-600 font-medium' 
                : index === currentStep - 1 
                ? 'text-blue-600 font-medium' 
                : 'text-gray-400'
            }`}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

export const HolidayProgress: React.FC<{ progress: number }> = ({ progress }) => {
  const getProgressEmoji = (progress: number) => {
    if (progress < 25) return '🎯';
    if (progress < 50) return '📝';
    if (progress < 75) return '🎨';
    if (progress < 100) return '✨';
    return '🎉';
  };

  const getProgressMessage = (progress: number) => {
    if (progress < 25) return 'Getting started...';
    if (progress < 50) return 'Great progress!';
    if (progress < 75) return 'Almost there!';
    if (progress < 100) return 'Final touches...';
    return 'Perfect!';
  };

  return (
    <div className="text-center mb-6">
      <div className="text-4xl mb-2">{getProgressEmoji(progress)}</div>
      <div className="text-sm text-gray-600">{getProgressMessage(progress)}</div>
    </div>
  );
};
