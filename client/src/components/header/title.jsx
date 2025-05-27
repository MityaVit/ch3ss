import { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider";
import {
  Menu,
  Transition,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";

export const Title = ({ pageTitle }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const additionalRoutes = [
    `${user?.role === "Coach" ? "openings" : "learn"}`,
    "home",
    ...(user?.role === "Student" ? ["analytics"] : []),
    "groups"
  ];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="flex items-center text-white ml-4 sm:ml-6 md:ml-8 gap-2 sm:gap-4 text-xl sm:text-2xl md:text-4xl">
      <span className="select-none">Ch3ss.{pageTitle}</span>

      {user ? (
        <>
          <div className="hidden sm:block relative">
            <Menu as="div" className="relative inline-block">
              <MenuButton className="bg-[#242323] hover:bg-gray-600 focus:outline-none focus:ring rounded-full p-2 mr-4 cursor-pointer">
                <img
                  src={`icons/header/${pageTitle}.svg`}
                  alt={`${pageTitle} icon`}
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  draggable="false"
                />
              </MenuButton>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <MenuItems className="absolute right-0 mt-2 w-40 bg-[#2C2C2B] border border-gray-600 rounded-xl shadow-lg focus:outline-none">
                  {additionalRoutes
                    .filter((r) => r !== pageTitle)
                    .map((r) => (
                      <MenuItem key={r}>
                        {({ active }) => (
                          <button
                            onClick={() => navigate(`/${r}`)}
                            className={`flex items-center w-full px-4 py-2 text-sm ${
                              active ? "bg-gray-700" : ""
                            }`}
                          >
                            <img
                              src={`icons/header/${r}.svg`}
                              alt={`${r} icon`}
                              className="w-6 h-6 mr-2"
                              draggable="false"
                            />
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                          </button>
                        )}
                      </MenuItem>
                    ))}
                </MenuItems>
              </Transition>
            </Menu>
          </div>
          <button
            className="sm:hidden bg-[#2C2C2B] hover:bg-gray-600 focus:outline-none focus:ring rounded-full p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <img
              src={`icons/header/${pageTitle}.svg`}
              alt={`${pageTitle} icon`}
              className="w-8 h-8"
              draggable="false"
            />
          </button>
          <Transition show={mobileMenuOpen} as={Fragment}>
            <Dialog
              open={mobileMenuOpen}
              onClose={setMobileMenuOpen}
              className="relative z-50 sm:hidden"
            >
              <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
              <DialogPanel className="fixed inset-y-0 left-0 w-64 bg-[#2C2C2B] p-4 z-50 overflow-auto">
                <button
                  className="absolute top-4 right-4 text-white text-2xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  &times;
                </button>
                <nav className="mt-8 space-y-4">
                  {additionalRoutes
                    .filter((r) => r !== pageTitle)
                    .map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          navigate(`/${r}`);
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center text-white text-lg p-2 hover:bg-gray-700 rounded"
                      >
                        <img
                          src={`icons/header/${r}.svg`}
                          alt={`${r} icon`}
                          className="w-6 h-6 mr-2"
                          draggable="false"
                        />
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    ))}
                </nav>
              </DialogPanel>
            </Dialog>
          </Transition>
        </>
      ) : (
        <div className="bg-[#2C2C2B] rounded-full p-2">
          <img
            src={`icons/header/${pageTitle}.svg`}
            alt={`${pageTitle} icon`}
            className="w-8 h-8"
            draggable="false"
          />
        </div>
      )}
    </div>
  );
};
