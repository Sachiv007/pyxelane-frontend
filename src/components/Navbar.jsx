import { NavLink, Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { UserContext } from "../contexts/UserContext";
import "../components/Navbar.css";

const Navbar = ({ onSearch, searchTerm }) => {
  const { cartItems } = useContext(CartContext);
  const { user } = useContext(UserContext);

  const handleSearchChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <nav className="navbar">

      {/* Top row: Logo + Search */}
      <div className="navbar-top-row">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/logo - 1.png" alt="Pyxelane" className="logo-image" />
          </Link>
        </div>

        <div className="navbar-center">
          <input
            type="text"
            placeholder="Search products..."
            className="search-bar"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Bottom row: Right buttons */}
      <div className="navbar-right">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-button active" : "nav-button"
          }
        >
          Shop
        </NavLink>

        {/* Uncomment this if you want the cart */}
        {/*
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive ? "nav-button cart-link active" : "nav-button cart-link"
          }
        >
          Cart
          {cartItems?.length > 0 && (
            <span className="cart-badge">{cartItems.length}</span>
          )}
        </NavLink>
        */}

        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-button active" : "nav-button"
          }
        >
          Info
        </NavLink>

        {user ? (
          <NavLink
            to="/user/upload-product"
            className={({ isActive }) =>
              isActive ? "nav-button active" : "nav-button"
            }
          >
            Sell
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "nav-button active" : "nav-button"
            }
          >
            Sign Up
          </NavLink>
        )}
      </div>

    </nav>
  );
};

export default Navbar;
