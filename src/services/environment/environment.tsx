import toast from "react-hot-toast";

export const fetchEnvironment = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/environment/getall`,
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
    toast.error("Couldn't fetch environment. Please try again later.");
  }
};
