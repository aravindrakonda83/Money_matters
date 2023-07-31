import { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { useHistory } from "react-router-dom";

const Logout = ({ onLogout }) => {
  const history = useHistory();
  const [showConfirmation, setShowConfirmation] = useState(true);

  const handleLogout = () => {
    // Perform any logout logic or API calls here if needed
    onLogout();
    history.push("/");
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    history.goBack();
  };

  const handleConfirmLogout = () => {
    setShowConfirmation(false);
    handleLogout();
  };

  if (showConfirmation) {
    confirmAlert({
      title: "Logout",
      message: "Are you sure you want to logout?",
      buttons: [
        {
          label: "Yes",
          onClick: handleConfirmLogout,
        },
        {
          label: "No",
          onClick: handleCancel,
        },
      ],
    });
  }

  return null; // This component doesn't render anything; it just handles the logout logic and confirmation
};

export default Logout;
