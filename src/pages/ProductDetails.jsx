import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error.message);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  const handleDownload = async () => {
    if (!product.file_url) return;

    setDownloading(true);
    try {
      const response = await fetch(product.file_url);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      const fileName = product.title
        ? product.title.replace(/\s+/g, "_") + product.file_url.substring(product.file_url.lastIndexOf("."))
        : "download";

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download file. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="product-details">
      <img
        src={product.preview_url || product.file_url}
        alt={product.title || product.name}
        className="product-image"
      />
      <div className="product-info">
        <h2>{product.title || product.name}</h2>
        <p>{product.description}</p>
        <p className="product-price">${(product.price).toFixed(2)}</p>

        <div className="product-buttons">
          <button
            onClick={handleDownload}
            className="download-btn"
            disabled={downloading}
          >
            {downloading ? "Downloading..." : "Download Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
