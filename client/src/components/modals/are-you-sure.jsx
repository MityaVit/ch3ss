import { Modal } from "../helpers/modal";

export const AreYouSureModal = ({ isOpen, onClose, message, action }) => {
  if (!isOpen) return null;

  return (
    <Modal
      title="Вы уверены?"
      isOpen={isOpen}
      onClose={onClose}
      description={message}
    >
      <div className="p-[1vw] text-[1.8vh]">
        <div className="mt-[2vh] flex flex-row w-full justify-evenly gap-5 items-center">
          <button
            onClick={onClose}
            className="w-full p-[1.2vh] rounded-md font-semibold bg-gray-500 text-white"
          >
            Отмена
          </button>
          <button
            onClick={action}
            className="w-full p-[1.2vh] rounded-md font-semibold bg-red-500 text-white"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </Modal>
  );
};
