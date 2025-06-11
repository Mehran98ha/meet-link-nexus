
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to home page - we've now moved all functionality to dedicated components
  return <Navigate to="/" replace />;
};

export default Index;
