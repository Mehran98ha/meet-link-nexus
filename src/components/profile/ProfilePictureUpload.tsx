
import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAnimatedToast } from '@/components/ui/toast-container';

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (url: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImageUrl,
  onImageUpdate
}) => {
  const { user } = useAuth();
  const { showToast } = useAnimatedToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "error",
        duration: 4000
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showToast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB",
        variant: "error",
        duration: 4000
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile.${fileExt}`;

      // Delete existing file if it exists
      if (currentImageUrl) {
        const existingPath = currentImageUrl.split('/').pop();
        if (existingPath) {
          await supabase.storage
            .from('profile-images')
            .remove([`${user.id}/${existingPath}`]);
        }
      }

      // Upload new file
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      // Update user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_image_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onImageUpdate(publicUrl);
      setPreviewUrl(null);

      showToast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been successfully updated",
        variant: "success",
        duration: 4000
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      showToast({
        title: "Upload Failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "error",
        duration: 4000
      });
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!user || !currentImageUrl) return;

    setIsUploading(true);
    try {
      // Delete file from storage
      const path = currentImageUrl.split('/').pop();
      if (path) {
        await supabase.storage
          .from('profile-images')
          .remove([`${user.id}/${path}`]);
      }

      // Update user profile
      const { error } = await supabase
        .from('users')
        .update({ profile_image_url: null })
        .eq('id', user.id);

      if (error) throw error;

      onImageUpdate('');

      showToast({
        title: "Profile Picture Removed",
        description: "Your profile picture has been removed",
        variant: "info",
        duration: 3000
      });

    } catch (error) {
      console.error('Error removing image:', error);
      showToast({
        title: "Removal Failed",
        description: "Failed to remove profile picture. Please try again.",
        variant: "error",
        duration: 4000
      });
    } finally {
      setIsUploading(false);
    }
  };

  const displayUrl = previewUrl || currentImageUrl;

  return (
    <div className="flex flex-col items-center space-y-ios-md">
      {/* Profile Picture Display */}
      <div className="relative">
        <div className="w-32 h-32 rounded-ios-2xl bg-gradient-to-br from-ios-blue/20 to-ios-purple/20 flex items-center justify-center overflow-hidden shadow-ios-lg border-4 border-ios-gray-6">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="w-12 h-12 text-ios-gray" />
          )}
        </div>

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-ios-2xl flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-white border-t-transparent"></div>
          </div>
        )}

        {/* Remove Button */}
        {currentImageUrl && !isUploading && (
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 w-8 h-8 bg-ios-red hover:bg-ios-red-dark text-white rounded-full flex items-center justify-center shadow-ios-md transition-all duration-200 hover:scale-110"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex flex-col items-center space-y-ios-sm">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-gradient-to-r from-ios-blue to-ios-purple hover:from-ios-blue-dark hover:to-ios-purple-dark text-white px-ios-lg py-ios-md rounded-ios-lg font-semibold shadow-ios-md hover:shadow-ios-lg transition-all duration-200 transform hover:scale-105"
        >
          <Upload className="w-4 h-4 mr-2" />
          {currentImageUrl ? 'Change Picture' : 'Upload Picture'}
        </Button>

        <p className="ios-text-caption text-ios-secondary-label text-center">
          JPG, PNG up to 5MB
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ProfilePictureUpload;
