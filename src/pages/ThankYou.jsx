import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function ThankYou() {
  const { clearCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const query = new URLSearchParams(location.search);
  const downloadsParam = query.get("downloads");

  let downloads = [];
  try {
    downloads = downloadsParam ? JSON.parse(downloadsParam) : [];
    console.log("Parsed downloads:", downloads);
  } catch (err) {
    console.error("Failed to parse download links:", err);
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 text-center">
      <h2 className="text-2xl font-bold mb-4">Thank You!</h2>

      {downloads.length > 0 ? (
        <>
          <p className="mb-4">
            Your download link{downloads.length > 1 ? "s are" : " is"} ready:
          </p>
          <ul className="mb-4 flex flex-col gap-2">
            {downloads.map((link, index) => (
              <li key={index}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                  download
                >
                  Download {index + 1}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-gray-600">
            Click the link{downloads.length > 1 ? "s" : ""} above to download your free product
            {downloads.length > 1 ? "s" : ""}.
          </p>
        </>
      ) : (
        <p className="text-red-600">No download links available for free items.</p>
      )}
    </div>
  );
}
