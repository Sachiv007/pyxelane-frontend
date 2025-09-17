import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './UploadProduct.css';

export default function UploadProduct() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [productFile, setProductFile] = useState(null);
  const [previewUrlLocal, setPreviewUrlLocal] = useState(null);
  const navigate = useNavigate();

  function sanitizeFileName(originalName) {
    return originalName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase();
  }

  const handlePreviewFileChange = (e) => {
    const file = e.target.files[0];
    setPreviewFile(file);
    setPreviewUrlLocal(file ? URL.createObjectURL(file) : null);
  };

  const handleProductFileChange = (e) => {
    setProductFile(e.target.files[0]);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const numericPrice = 0; // free for now
    let previewUrl = null;
    let productUrl = null;

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw new Error(userError.message);
      if (!user) throw new Error("You must be logged in to upload a product");

      if (previewFile) {
        const previewFileName = `${Date.now()}-${sanitizeFileName(previewFile.name)}`;
        const { error: previewError } = await supabase.storage.from('products-images').upload(previewFileName, previewFile);
        if (previewError) throw new Error(previewError.message);
        const { data } = supabase.storage.from('products-images').getPublicUrl(previewFileName);
        previewUrl = data.publicUrl;
      }

      if (productFile) {
        const productFileName = `${Date.now()}-${sanitizeFileName(productFile.name)}`;
        const { error: productError } = await supabase.storage.from('products-files').upload(productFileName, productFile);
        if (productError) throw new Error(productError.message);
        const { data } = supabase.storage.from('products-files').getPublicUrl(productFileName);
        productUrl = data.publicUrl;
      }

      const { error: insertError } = await supabase.from('products').insert([{
        title,
        price: numericPrice,
        description,
        preview_url: previewUrl,
        file_url: productUrl,
        file_path: productFile ? productFile.name : null,
        user_id: user.id
      }]);

      if (insertError) throw new Error(insertError.message);

      alert("✅ Product uploaded successfully!");
      navigate('/user/products');

    } catch (err) {
      console.error(err);
      alert(`❌ ${err.message}`);
    }
  }

  return (
    <div className="upload-container">
      <h1>Upload Product</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Product Name" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" />

        {/* Preview Image */}
        <input type="file" id="previewFile" accept="image/*" onChange={handlePreviewFileChange} required />
        <label htmlFor="previewFile" className="file-label">Choose Product Preview Image</label>
        {previewUrlLocal && (
          <div className="preview-box">
            <img src={previewUrlLocal} alt="Preview" className="preview-image" />
          </div>
        )}

        {/* Product File */}
        <input type="file" id="productFile" accept=".zip,.pdf,.wav,.mp3,.midi" onChange={handleProductFileChange} required />
        <label htmlFor="productFile" className="file-label">Choose Product File</label>

        <button type="submit">Upload Product</button>
      </form>
    </div>
  );
}
