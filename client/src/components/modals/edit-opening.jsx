import { Modal } from '../helpers/modal'
import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { getCoachOpenings, updateGroupOpening } from '../../api';

export const EditOpeningModal = ({
  isOpen,
  onClose,
  currentOpeningName,
  groupId,
  onUpdate,
  userId,
}) => {
  const [openings, setOpenings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOpening, setSelectedOpening] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const resp = await getCoachOpenings({ userId });
        const list = Array.isArray(resp) ? resp : resp.data;
        setOpenings(list || []);
      } catch (e) {
        console.error(e);
        setOpenings([]);
      }
    })();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setSelectedOpening(null);
      setSearchTerm("");
      setCurrentPage(1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && openings.length > 0) {
      const match = openings.find(
        (op) => op.OpeningName === currentOpeningName
      );
      setSelectedOpening(match || null);
    }
  }, [isOpen, openings, currentOpeningName]);

  const fuse = useMemo(
    () =>
      new Fuse(openings, {
        keys: ["OpeningName"],
        threshold: 0.4,
      }),
    [openings]
  );

  const filteredOpenings = useMemo(() => {
    if (!searchTerm.trim()) return openings;
    return fuse.search(searchTerm).map((r) => r.item);
  }, [searchTerm, openings, fuse]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOpenings.length / pageSize)
  );
  const paginatedOpening = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOpenings.slice(start, start + pageSize);
  }, [filteredOpenings, currentPage]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const isChanged =
    Boolean(selectedOpening) &&
    selectedOpening.OpeningName !== currentOpeningName;

  const handleSave = async () => {
    if (!isChanged || isSaving) return;
    setIsSaving(true);
    try {
      await updateGroupOpening(groupId, selectedOpening.idOpenings);
      if (onUpdate) onUpdate(selectedOpening);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Изменить дебют">
      <div className="flex flex-col gap-4 p-4 bg-[#2C2C2B] text-white h-[80vh]">

        {/* Текущий дебют */}
        <div className="px-3 py-2 bg-[#505050] rounded text-sm">
          <strong>Выбранный дебют:</strong>{" "}
          {currentOpeningName || "—"}
        </div>

        {openings.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-[#818181]">
            Нет доступных дебютов.
          </div>
        ) : (
          <>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Поиск дебютов..."
              className="p-2 bg-[#505050] placeholder-[#818181] rounded outline-none border border-[#6a6a6a] focus:border-[#818181] focus:bg-[#585858] transition-all"
            />

            <div className="flex-1 overflow-auto bg-[#2C2C2B] border border-[#505050] rounded">
              {/* NEW: "No Opening" option */}
              <div
                onClick={() =>
                  setSelectedOpening({ idOpenings: null, OpeningName: "Без дебюта" })
                }
                className={`p-2 cursor-pointer flex items-center justify-between ${
                  !selectedOpening || selectedOpening.idOpenings === null
                    ? "bg-[#505050]"
                    : "hover:bg-[#505050]/50"
                }`}
              >
                <span>Без дебюта</span>
              </div>
              {paginatedOpening.map((op) => (
                <div
                  key={op.idOpenings}
                  onClick={() => setSelectedOpening(op)}
                  className={`p-2 cursor-pointer flex items-center justify-between ${
                    selectedOpening?.idOpenings === op.idOpenings
                      ? "bg-[#505050]"
                      : "hover:bg-[#505050]/50"
                  }`}
                >
                  <span>{op.OpeningName}</span>
                </div>
              ))}
              {paginatedOpening.length === 0 && (
                <div className="p-4 text-center text-[#818181]">
                  Дебюты не найдены.
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-sm">
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(p - 1, 1))
                }
                disabled={currentPage === 1}
                className="px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Предыдущая
              </button>
              <span>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Следующая
              </button>
            </div>
          </>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 w-full rounded font-semibold transition-all bg-gray-500 text-white"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={!isChanged || isSaving}
            className={`p-2 w-full rounded font-semibold transition-all ${
              isChanged
                ? "bg-gradient-to-r from-green-500 via-blue-400 to-purple-500 text-white"
                : "bg-[#505050] text-[#818181] cursor-not-allowed"
            }`}
          >
            {isSaving ? "Сохранение..." : "Подтвердить"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
