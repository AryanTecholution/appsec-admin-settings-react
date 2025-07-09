import toast from "react-hot-toast";
import axios from "axios";

export const fetchRole = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/role/getall`,
      {
        cache: "no-store",
        next: {
          revalidate: 0,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    toast.error("Couldn't fetch roles. Please try again later.");
  }
};
