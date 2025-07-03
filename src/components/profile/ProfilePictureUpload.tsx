
import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAnimatedToast } from '@/components/ui/toast-container';
import AvatarFallback from './AvatarFallback';

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (url: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImageUrl,
  onImageUpdate
}) => {
  const { user, updateProfileImage } = useAuth();
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

    // Validate image dimensions
    const img = new Image();
    img.onload = () => {
      if (img.width < 100 || img.height < 100) {
        showToast({
          title: "Image Too Small",
          description: "Please select an image at least 100x100 pixels",
          variant: "error",
          duration: 4000
        });
        return;
      }
      
      // Show preview and upload
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      uploadFile(file);
    };
    
    img.onerror = () => {
      showToast({
        title: "Invalid Image",
        description: "Please select a valid image file",
        variant: "error",
        duration: 4000
      });
    };
    
    img.src = URL.createObjectURL(file);

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

      // Update both local state and auth context
      onImageUpdate(publicUrl);
      updateProfileImage(publicUrl);
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

      // Update both local state and auth context
      onImageUpdate('');
      updateProfileImage('');

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
    <div className="flex flex-col items-center space-y-4">
      {/* Profile Picture Display */}
      <div className="relative">
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-200">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <AvatarFallback username={user?.username} size="lg" className="w-full h-full rounded-none border-0" />
          )}
        </div>

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-white border-t-transparent"></div>
          </div>
        )}

        {/* Remove Button */}
        {currentImageUrl && !isUploading && (
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex flex-col items-center space-y-3">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <Upload className="w-4 h-4 mr-2" />
          {currentImageUrl ? 'Change Picture' : 'Upload Picture'}
        </Button>

        <p className="text-sm text-gray-500 text-center">
          JPG, PNG up to 5MB • Min 100x100px
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
