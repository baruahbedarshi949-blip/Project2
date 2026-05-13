
//storeContext Corrected
import axios from "axios";
import {
  createContext,
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

  const url = "https://project2-9t5s.onrender.com";

  const [food_list, setFoodList] = useState([]);

  const [cartItems, setCartItems] = useState({});

  const [token, setToken] = useState("");

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = async (itemId) => {

    setCartItems((prev) => {

      const updatedCart = prev || {};

      if (!updatedCart[itemId]) {

        return {
          ...updatedCart,
          [itemId]: 1,
        };

      } else {

        return {
          ...updatedCart,
          [itemId]: updatedCart[itemId] + 1,
        };

      }

    });

    try {

      if (token) {

        await axios.post(
          url + "/api/cart/add",
          { itemId },
          {
            headers: {
              token,
            },
          }
        );

      }

      toast.success("Item Added");

    } catch (error) {

      console.log(error);

      toast.error("Cart Error");

    }

  };

  // =========================
  // REMOVE FROM CART
  // =========================

  const removeFromCart = async (itemId) => {

    setCartItems((prev) => {

      const updatedCart = prev || {};

      return {
        ...updatedCart,
        [itemId]: updatedCart[itemId] - 1,
      };

    });

    try {

      if (token) {

        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          {
            headers: {
              token,
            },
          }
        );

      }

      toast.error("Item Removed");

    } catch (error) {

      console.log(error);

      toast.error("Remove Error");

    }

  };

  // =========================
  // TOTAL CART AMOUNT
  // =========================

  const getTotalCartAmount = () => {

    let totalAmount = 0;

    for (const item in cartItems) {

      if (cartItems[item] > 0) {

        let itemInfo = food_list.find(
          (product) =>
            String(product._id) === String(item)
        );

        if (itemInfo) {

          totalAmount +=
            itemInfo.price * cartItems[item];

        }

      }

    }

    return totalAmount;

  };

  // =========================
  // FETCH FOOD LIST
  // =========================

  const fetchFoodList = async () => {

    try {

      const response = await axios.get(
        url + "/api/food/list"
      );

      if (response.data.success) {

        setFoodList(response.data.data);

      } else {

        toast.error("Food List Error");

      }

    } catch (error) {

      console.log(error);

      toast.error("Backend Connection Error");

    }

  };

  // =========================
  // LOAD CART DATA
  // =========================

  const loadCartData = async (token) => {

    try {

      const response = await axios.post(
        url + "/api/cart/get",
        {},
        {
          headers: {
            token,
          },
        }
      );

      setCartItems(
        response.data.cartData || {}
      );

    } catch (error) {

      console.log(error);

      setCartItems({});

    }

  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    async function loadData() {

      await fetchFoodList();

      const storedToken =
        localStorage.getItem("token");

      if (storedToken) {

        setToken(storedToken);

        await loadCartData(storedToken);

      }

    }

    loadData();

  }, []);

  // =========================
  // CONTEXT VALUE
  // =========================

  const contextValue = {

    food_list,

    cartItems,

    setCartItems,

    addToCart,

    removeFromCart,

    getTotalCartAmount,

    url,

    token,

    setToken,

  };

  return (

    <StoreContext.Provider
      value={contextValue}
    >

      {props.children}

    </StoreContext.Provider>

  );

};

export default StoreContextProvider;
