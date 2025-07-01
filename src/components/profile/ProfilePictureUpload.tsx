
import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (url: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ 
  currentImageUrl, 
  onImageUpdate 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      const publicUrl = data.publicUrl;

      // Update user profile in database
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_image_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onImageUpdate(publicUrl);
      setPreviewUrl(null);
      URL.revokeObjectURL(objectUrl);

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated",
        className: "bg-ios-green text-ios-label-on-green border-ios-green/20"
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive"
      });
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const displayImage = previewUrl || currentImageUrl;

  return (
    <div className="relative group">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-ios-2xl overflow-hidden bg-gradient-to-br from-ios-blue/20 to-ios-purple/20 border-4 border-white shadow-ios-lg">
        {displayImage ? (
          <img
            src={displayImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="h-8 w-8 sm:h-12 sm:w-12 text-ios-blue" />
          </div>
        )}
        
        {/* Upload overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          {isUploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
          ) : (
            <Upload className="h-6 w-6 text-white" />
          )}
        </div>
      </div>

      {/* Upload button */}
      <label className="absolute -bottom-2 -right-2 cursor-pointer">
        <div className="w-10 h-10 bg-ios-blue rounded-full flex items-center justify-center shadow-ios-md border-4 border-white hover:bg-ios-blue-dark transition-colors duration-200 ios-spring">
          <Camera className="h-5 w-5 text-white" />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default ProfilePictureUpload;
