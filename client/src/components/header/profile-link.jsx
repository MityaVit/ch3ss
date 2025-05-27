import { AuthModal } from "../modals/auth";
import { useState } from "react";
import { useAuth } from "../../AuthProvider";
import { ProfileModal } from "../modals/profile";

export const Profile = () => {
    const { user } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const handleProfileModalOpen = () => setIsProfileModalOpen(true);

    return (
        <>
            <div className="mr-[4.16vw] ml-auto cursor-pointer">
                {
                    user ? (
                        <>
                            <ProfileModal
                                isOpen={isProfileModalOpen}
                                onClose={() => setIsProfileModalOpen(false)}
                            />
                            <img
                                src="icons/profile.svg"
                                draggable="false"
                                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
                                onClick={handleProfileModalOpen}
                            />
                        </>
                    ) : (
                        <span
                            className="text-[2.2vh] text-[#818181] hover:text-[#bdbdbd] select-none"
                            onClick={() => setIsAuthModalOpen(true)}
                        >
                            Войти
                        </span>
                    )
                }
            </div>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
};