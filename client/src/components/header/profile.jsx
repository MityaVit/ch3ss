import { AuthModal } from "../modals/auth";
import { useState } from "react";
import { useAuth } from "../../AuthProvider";

export const Profile = () => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleProfileNavigation = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <div className="mr-[4.16vw] ml-auto cursor-pointer">
        {user ? (
          <img
            src="icons/profile.svg"
            draggable="false"
            className="w-[4vw] h-[6vh]"
            onClick={handleProfileNavigation}
          />
        ) : (
          <span
            className="text-[2.2vh] text-[#818181] hover:text-[#bdbdbd] select-none"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Sign in
          </span>
        )}
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};
