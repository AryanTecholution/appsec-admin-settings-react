import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminSettingsRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin-settings/users", { replace: true });
  }, [navigate]);

  return null;
};

export default AdminSettingsRedirect;
