import React, { useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '../supabaseClient';
import Cropper from 'react-easy-crop';
import { UserContext } from '../contexts/UserContext';
import './MyAccount.css';

export default function MyAccount() {
  const { refreshAvatar } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setUsername(user?.user_metadata?.username || "");
      setNewUsername(user?.user_metadata?.username || "");

      if (user?.user_metadata?.avatar_path) {
        const { data, error } = await supabase.storage
          .from('avatars')
          .createSignedUrl(user.user_metadata.avatar_path, 60 * 60);
        if (!error) setAvatarUrl(data.signedUrl);
      }
    }
    fetchUser();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setShowCropper(true);
    }
  };

  const getCroppedImg = useCallback((imageSrc, cropPixels) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = cropPixels.width;
        canvas.height = cropPixels.height;
        ctx.drawImage(
          image,
          cropPixels.x,
          cropPixels.y,
          cropPixels.width,
          cropPixels.height,
          0,
          0,
          cropPixels.width,
          cropPixels.height
        );
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Canvas is empty'));
          resolve(blob);
        }, 'image/jpeg');
      };
      image.onerror = (err) => reject(err);
    });
  }, []);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const saveCroppedImage = async () => {
    if (!preview || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(preview, croppedAreaPixels);
    const croppedFile = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
    setImage(croppedFile);
    setPreview(URL.createObjectURL(croppedFile));
    setShowCropper(false);
  };

  const uploadProfilePicture = async () => {
    if (!image || !user) return;
    const { data: existingFiles } = await supabase.storage.from('avatars').list(user.id + "/");
    if (existingFiles?.length > 0) {
      const oldFilePaths = existingFiles.map(f => `${user.id}/${f.name}`);
      await supabase.storage.from('avatars').remove(oldFilePaths);
    }

    const filePath = `${user.id}/profile.jpg`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, image, { upsert: true });
    if (uploadError) return alert('Upload failed: ' + uploadError.message);

    const { error: updateError } = await supabase.auth.updateUser({ data: { avatar_path: filePath } });
    if (updateError) return alert('Failed to update user profile: ' + updateError.message);

    const { data } = await supabase.storage.from('avatars').createSignedUrl(filePath, 60 * 60);
    setAvatarUrl(data.signedUrl);
    setPreview(null);
    setImage(null);
    refreshAvatar();
    alert('Profile picture uploaded successfully!');
  };

  const updateUsername = async () => {
    if (!newUsername || !user) return;
    const { error } = await supabase.auth.updateUser({ data: { username: newUsername } });
    if (error) alert("Failed to update username: " + error.message);
    else { setUsername(newUsername); alert("Username updated successfully!"); }
  };

  return (
    <div className="account-container">
      <h1>My Account</h1>

      <div className="avatar-wrapper">
        {avatarUrl && !preview && <img src={avatarUrl} alt="Profile" className="avatar" />}
        {preview && <img src={preview} alt="Preview" className="avatar" />}
      </div>

      {/* Hidden file input */}
      <input type="file" accept="image/*" id="avatarInput" onChange={handleImageChange} />
      {/* Label styled as button */}
      <label htmlFor="avatarInput" className="choose-file-label">
        Choose New Profile Pic
      </label>
      <button onClick={uploadProfilePicture} disabled={!image}>
        Upload New Profile Picture
      </button>

      <div className="username-section">
        <label>Username</label>
        <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
        <button onClick={updateUsername}>Save Username</button>
      </div>

      {showCropper && (
        <div className="cropper-overlay">
          <div className="cropper-container">
            <Cropper
              image={preview}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
            <div className="cropper-controls">
              <button onClick={() => setShowCropper(false)}>Cancel</button>
              <button onClick={saveCroppedImage}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
