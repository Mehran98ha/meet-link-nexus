
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="bg-white border-gray-100 shadow-sm animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-md w-4/5"></div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded-md w-1/4"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
