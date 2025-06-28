
import React from 'react';
import { LogIn } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AuthPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const AuthPromptDialog: React.FC<AuthPromptDialogProps> = ({
  isOpen,
  onClose,
  onLoginClick
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            You need to be logged in to add, edit, or delete meeting links.
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onLoginClick}>
              <LogIn className="h-4 w-4 mr-2" />
              Login / Sign Up
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthPromptDialog;
