import React from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import { RootState } from "../app/store";
import { AppDispatch } from "../App/store";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart ,faBell } from "@fortawesome/free-solid-svg-icons";
import { getCart } from "../features/cart/cartThunk";
import {
    fetchWishlist,
} from "../features/wishlist/wishlistThunk";
import { useEffect } from "react";

interface Props {
    variant?: "desktop" | "mobile";
    t?: (key: string) => string; // for translation (optional)
    setMobileMenuOpen?: (open: boolean) => void;
}

const CartWishlistCount: React.FC<Props> = ({ variant = "desktop", t, setMobileMenuOpen }) => {
    const dispatch = useDispatch<AppDispatch>();


    // Redux state se values
    const wishlistItems = useAppSelector((state: RootState) => state.wishlist?.items || []);
    const cartItems = useAppSelector((state: RootState) => state.cart?.items || []);

    const wishlistCount = wishlistItems.length;
    const cartCount = cartItems.length;
    

    useEffect(() => {
        getCart();
        fetchWishlist();
    }, []);

    useEffect(() => {
        dispatch(getCart());
    }, [dispatch]);


    if (variant === "desktop") {
        return (
            <>
                {[
                    { icon: faHeart, count: wishlistCount, path: "/wishlist" },
                    { icon: faShoppingCart, count: cartCount, path: "/cart" },
                    // { icon: faBell, count: cartCount, path: "/notification" },
                ].map(({ icon, count, path }, index) => {
                    const content = (
                        <div key={index} className="relative cursor-pointer">
                            <FontAwesomeIcon icon={icon} size="lg" />
                            {count > 0 && (
                                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {count}
                                </span>
                            )}
                        </div>
                    );
                    return (
                        <Link to={path} key={index} className="cursor-pointer">
                            {content}
                        </Link>
                        
                    );
                })}
            </>
        );
    }

    // mobile view
    return (
        <>
            <Link
                to="/wishlist"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg"
                onClick={() => setMobileMenuOpen?.(false)}
            >
                <FontAwesomeIcon icon={faHeart} className="mr-3 w-4" />
                {t ? t("wishlist") : "Wishlist"}
                {wishlistCount > 0 && (
                    <span className="ml-auto bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {wishlistCount}
                    </span>
                )}
            </Link>

            <Link
                to="/cart"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 rounded-lg"
                onClick={() => setMobileMenuOpen?.(false)}
            >
                <FontAwesomeIcon icon={faShoppingCart} className="mr-3 w-4" />
                {t ? t("cart") : "Cart"}
                {cartCount > 0 && (
                    <span className="ml-auto bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                    </span>
                )}
            </Link>
        </>
    );
};

export default CartWishlistCount;
