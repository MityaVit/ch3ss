// src/pages/OpeningsPage.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Fuse from "fuse.js";
import {
  getCoachOpenings,
  createCustomOpening,
  getOpeningMoves,
  updateOpeningMoves,
  updateOpening,
  deleteCustomOpening,
} from "../../../api/openings";
import { useAuth } from "../../../AuthProvider";
import { AreYouSureModal } from "../../modals/are-you-sure";

const LOCAL_STORAGE_KEY = "unsavedOpening";

const OpeningsPage = ({ children }) => {
  const { user } = useAuth();
  const userId = user.idUsers;

  // Список всех своих дебютов
  const [openings, setOpenings] = useState([]);
  // Для поиска и пагинации
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOpenings, setFilteredOpenings] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;  // ← изменили на 6

  const [currentOpeningId, setCurrentOpeningId] = useState(null);
  const [openingName, setOpeningName] = useState("");
  const [colorAs, setColorAs] = useState("w");
  const [moves, setMoves] = useState([]); // [{ FEN, Description }]
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isRecording, setIsRecording] = useState(false);

  const [error, setError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const chessRef = useRef(new Chess());

  const loadOpenings = useCallback(async () => {
    setError("");
    try {
      const data = await getCoachOpenings({ userId });
      setOpenings(data.filter(o => !o.createdBySystem));
    } catch (e) {
      setError(e.message);
    }
  }, [userId]);

  useEffect(() => {
    loadOpenings();
  }, [loadOpenings]);

  // Fuzzy search + пагинация
  useEffect(() => {
    const fuse = new Fuse(openings, {
      keys: ["OpeningName"],
      threshold: 0.3,
    });
    const result = searchQuery
      ? fuse.search(searchQuery).map((r) => r.item)
      : openings;
    setFilteredOpenings(result);
    setPage(1);
  }, [searchQuery, openings]);

  const paginated = filteredOpenings.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Проверяем localStorage на наличие бэкапа
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      try {
        const obj = JSON.parse(raw);
        setCurrentOpeningId(obj.id || null);
        setOpeningName(obj.name);
        setColorAs(obj.as);
        setMoves(obj.moves);
        setCurrentMoveIndex(obj.moves.length - 1);
        chessRef.current.load(obj.moves[obj.moves.length - 1]?.FEN || "start");
      } catch {}
    }
  }, []);

  useEffect(() => {
    const payload = {
      id: currentOpeningId,
      name: openingName,
      as: colorAs,
      moves,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
  }, [currentOpeningId, openingName, colorAs, moves]);

  // Загрузка ходов выбранного дебюта
  const loadOpeningMoves = useCallback(async (opening) => {
    setError("");
    try {
      const data = await getOpeningMoves({ openingId: opening.idOpenings });
      const sorted = data
        .slice()
        .sort((a, b) => a.MoveNumber - b.MoveNumber)
        .map((m) => ({ FEN: m.FEN, Description: m.Description }));
      setCurrentOpeningId(opening.idOpenings);
      setOpeningName(opening.OpeningName);
      setColorAs(opening.as);
      setMoves(sorted);
      setCurrentMoveIndex(sorted.length - 1);
      chessRef.current.reset();
      if (sorted.length) chessRef.current.load(sorted[sorted.length - 1].FEN);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  // Обработка ходов на доске
  const onPieceDrop = (from, to) => {
    setError("");
    if (!isRecording) return false;
    const chess = chessRef.current;
    const move = chess.move({ from, to, promotion: "q" });
    if (move) {
      const newFEN = chess.fen();
      const newMoves = moves.slice(0, currentMoveIndex + 1);
      newMoves.push({ FEN: newFEN, Description: "" });
      setMoves(newMoves);
      setCurrentMoveIndex(newMoves.length - 1);
      return true;
    }
    return false;
  };

  const undoMove = () => {
    if (currentMoveIndex < 0) return;
    const chess = new Chess();
    const prev = moves.slice(0, currentMoveIndex);
    chess.reset();
    prev.forEach((m) => chess.load(m.FEN));
    setMoves(prev);
    setCurrentMoveIndex(prev.length - 1);
    chessRef.current = chess;
  };

  const gotoPrev = () => {
    if (currentMoveIndex <= 0) return;
    const idx = currentMoveIndex - 1;
    setCurrentMoveIndex(idx);
    chessRef.current.load(moves[idx].FEN);
  };
  const gotoNext = () => {
    if (currentMoveIndex >= moves.length - 1) return;
    const idx = currentMoveIndex + 1;
    setCurrentMoveIndex(idx);
    chessRef.current.load(moves[idx].FEN);
  };

  // Сохранение дебюта
  const saveOpening = async () => {
    setError("");
    try {
      if (!openingName.trim()) {
        setError("Введите название дебюта");
        return;
      }
      const payload = {
        userId,
        openingName,
        as: colorAs,
        movesArray: moves.map((m, i) => ({
          FEN: m.FEN,
          Description: m.Description,
          MoveNumber: i + 1,
          idOpenings: currentOpeningId,
        })),
      };
      if (currentOpeningId) {
        await updateOpening({
          openingId: currentOpeningId,
          updateData: { OpeningName: openingName, as: colorAs },
        });
        await updateOpeningMoves({
          openingId: currentOpeningId,
          openingMoves: payload.movesArray,
        });
      } else {
        await createCustomOpening(payload);
      }
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setCurrentOpeningId(null);
      setOpeningName("");
      setColorAs("w");
      setMoves([]);
      setCurrentMoveIndex(-1);
      setIsRecording(false);
      await loadOpenings();
    } catch (e) {
      setError(e.message);
    }
  };

  // Удаление дебюта
  const deleteOpening = async () => {
    setError("");
    if (!currentOpeningId) {
      return;
    }
    try {
      await deleteCustomOpening({ openingId: currentOpeningId, userId: userId });
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setCurrentOpeningId(null);
      setOpeningName("");
      setColorAs("w");
      setMoves([]);
      setCurrentMoveIndex(-1);
      chessRef.current.reset();
      await loadOpenings();
    } catch (e) {
      setError(e.message);
    }
  }
  
  return (
    <div className="flex flex-col h-screen w-screen">
      {children}

      <h1 className="text-3xl font-semibold mt-2 mb-4 px-6">Мои дебюты</h1>
      <div className="flex items-center justify-between px-6 mb-6">
        <input
          className="w-full max-w-md px-4 py-2 bg-[#2C2C2B] border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
          placeholder="Поиск дебютов…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
            className="px-3 py-1 bg-[#2C2C2B] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
          >
            ←
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(filteredOpenings.length / PAGE_SIZE)}
            className="px-3 py-1 bg-[#2C2C2B] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
          >
            →
          </button>
          <button
            onClick={() => {
              localStorage.removeItem(LOCAL_STORAGE_KEY);
              setCurrentOpeningId(null);
              setOpeningName("");
              setColorAs("w");
              setMoves([]);
              setCurrentMoveIndex(-1);
              chessRef.current.reset();
            }}
            disabled={!currentOpeningId}
            className="px-4 py-2 bg-indigo-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500"
          >
            + Новый дебют
          </button>
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 mb-6">
        {paginated.map((o) => (
          <li
            key={o.idOpenings}
            onClick={() => loadOpeningMoves(o)}
            className={`p-4 bg-[#2C2C2B] rounded-lg cursor-pointer shadow ${
              o.idOpenings === currentOpeningId
                ? "border-2 border-indigo-500"
                : "hover:bg-gray-700"
            }`}
          >
            {o.OpeningName}
          </li>
        ))}
      </ul>

      {/* Редактор дебюта */}
      <div className="flex flex-col md:flex-row flex-1 px-6 gap-8">
        {/* Левая колонка */}
        <div className="flex-shrink-0 w-full sm:w-96 mx-auto">
          <div className="relative">
            <Chessboard
              position={currentMoveIndex >= 0 ? moves[currentMoveIndex].FEN : "start"}
              onPieceDrop={onPieceDrop}
              boardWidth={400}
              boardOrientation={colorAs === "b" ? "black" : "white"}
              className="shadow-lg rounded-lg bg-[#2C2C2B]"
            />
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={undoMove}
              disabled={!isRecording}
              className="px-3 py-1 bg-[#2C2C2B] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              Отменить ход
            </button>
            <button
              onClick={gotoPrev}
              disabled={currentMoveIndex <= 0}
              className="px-3 py-1 bg-[#2C2C2B] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              ←
            </button>
            <button
              onClick={gotoNext}
              disabled={currentMoveIndex >= moves.length - 1}
              className="px-3 py-1 bg-[#2C2C2B] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              →
            </button>
          </div>

          <div className="mt-4">
            {!isRecording ? (
              <button
                onClick={() => setIsRecording(true)}
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
              >
                Начать запись
              </button>
            ) : (
              <button
                onClick={() => setIsRecording(false)}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
              >
                Остановить запись
              </button>
            )}
          </div>
        </div>

        {/* Правая колонка */}
        <div className="flex-1">
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="mb-4">
            <label className="block mb-1">Название:</label>
            <input
              className="w-full px-3 py-2 bg-[#2C2C2B] border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              value={openingName}
              onChange={(e) => setOpeningName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Играю за:</label>
            <select
              className="w-full px-3 py-2 bg-[#2C2C2B] border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              value={colorAs}
              onChange={(e) => setColorAs(e.target.value)}
            >
              <option value="w">Белые</option>
              <option value="b">Чёрные</option>
            </select>
          </div>

          {currentMoveIndex >= 0 ? (
            <div className="mb-4">
              <label className="block mb-1">
                Описание хода №{currentMoveIndex + 1}:
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 bg-[#2C2C2B] border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                value={moves[currentMoveIndex].Description}
                onChange={(e) => {
                  const upd = [...moves];
                  upd[currentMoveIndex] = {
                    ...upd[currentMoveIndex],
                    Description: e.target.value,
                  };
                  setMoves(upd);
                }}
              />
            </div>
          ) : (
            <p className="italic text-gray-400">
              Сделайте первый ход на доске, чтобы добавить описание
            </p>
          )}
          <button
            onClick={saveOpening}
            className="mt-4 px-6 py-2 disabled:bg-indigo-600/30 disabled:cursor-not-allowed bg-indigo-600 rounded hover:bg-indigo-500"
            disabled={!openingName.trim() || !moves.length}
          >
            {currentOpeningId ? "Сохранить изменения" : "Создать дебют"}
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="ml-4 mt-4 px-6 py-2 disabled:bg-red-600/30 disabled:cursor-not-allowed bg-red-600 rounded hover:bg-red-500"
            disabled={!currentOpeningId}
          >
            Удалить дебют
          </button>
        </div>
      </div>
      <AreYouSureModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        message={`Вы хотите удалить выбранный дебют?`}
        action={async () => {
          await deleteOpening();
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
};

export default OpeningsPage;
