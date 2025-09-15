import { NavLink, Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { UserContext } from "../contexts/UserContext";
import "../components/Navbar.css";

const Navbar = ({ onSearch, searchTerm }) => {
  const { cartItems } = useContext(CartContext);
  const { user, avatarUrl } = useContext(UserContext);

  const handleSearchChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src="/logo - 1.png" alt="Sapphire Lane" className="logo-image" />
        </Link>
      </div>

      {/* Left section */}
      <div className="navbar-left">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-button active" : "nav-button"
          }
        >
          Shop
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
            Sign Up/Login
          </NavLink>
        )}

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

        {/* About Us Link */}
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-button active" : "nav-button"
          }
        >
          Info
        </NavLink>
      </div>

      {/* Center search bar */}
      <div className="navbar-center">
        <input
          type="text"
          placeholder="Search products..."
          className="search-bar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Right section (avatar) */}
    {/*}
      {user && (
        <div className="navbar-right">
          <NavLink to="/user">
            <img
              src={avatarUrl || "/default-avatar.png"}
              alt="Profile"
              className="profile-picture"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
          </NavLink>
        </div>
      )}*/}
    </nav>
  );
};

export default Navbar;
