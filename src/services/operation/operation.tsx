import toast from "react-hot-toast";

export const fetchOperation = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/operation/getall`,
      {
        cache: "no-store",
        next: {
          revalidate: 0,
        },
      }
    );

    if (!response.ok) {
      // Show error toast and throw an error to be caught
      toast.error(`Error fetching operations: ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      toast.error("Invalid data format received");
      throw new Error("Invalid data format: expected an array");
    }

    return data;
  } catch (err) {
    console.error("Fetch Operation Error: ", err);
    toast.error("Couldn't fetch operations. Please try again later.");
    return []; // fallback to empty array to prevent crashing
  }
};
