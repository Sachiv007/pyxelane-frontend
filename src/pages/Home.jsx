import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Home.css";

export default function Home({ searchTerm = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const lastFetchRef = useRef(0);

  const fetchProducts = async () => {
    const now = Date.now();
    if (now - lastFetchRef.current < 5000) return;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setProducts((prev) => {
        const prevIds = prev.map((p) => p.id).join(",");
        const newIds = data.map((p) => p.id).join(",");
        return prevIds === newIds ? prev : data;
      });
      lastFetchRef.current = now;
    } else console.error(error);

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    const handleVisibilityChange = () => {
      if (!document.hidden) fetchProducts();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const safeSearch = (searchTerm || "").toLowerCase();
  const filteredProducts = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(safeSearch) ||
      p.description?.toLowerCase().includes(safeSearch)
  );

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="home-container">
      <h1>Welcome to Pyxelane</h1>
      <p>A hub for digital creators and enthusiasts—browse, explore, and get inspired.</p>

      <h2>Latest Products</h2>
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`}>
                {product.preview_url && (
                  <img src={product.preview_url} alt={product.title} />
                )}
                <h3>{product.title}</h3>
                <p>${product.price}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}
