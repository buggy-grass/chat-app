import React, { useState } from 'react';
import { Button, Spinner } from '@fluentui/react-components';

interface LoadingButtonProps {
  loading: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ loading, onClick, children }) => {
  return (
    <Button appearance="primary" style={{minHeight:"36px"}} onClick={onClick} disabled={loading}>
      {loading ? <Spinner size="extra-small" /> : children}
    </Button>
  );
};

export default LoadingButton;
