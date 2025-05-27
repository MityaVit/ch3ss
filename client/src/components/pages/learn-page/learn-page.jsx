import { useState, useEffect, useCallback } from "react";
import { MoveButton } from "../../helpers/move-button";
import { useAuth } from "../../../AuthProvider";
import {
  getUserOpenings,
  getOpeningMoves,
  createUserStatisticsBatch,
} from "../../../api";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { v4 as uuidv4 } from "uuid";

const LearnPage = ({ children }) => {
  const { user } = useAuth();

  /* состояния и данные */
  const [openings, setOpenings] = useState([]);
  const [openingMoves, setOpeningMoves] = useState([]);
  const [selectedOpeningId, setSelectedOpeningId] = useState(null);

  /* режимы */
  const [startedLearning, setStartedLearning] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);

  /* индексы ходов */
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [practiceCurrentIndex, setPracticeCurrentIndex] = useState(null);
  const [practicePlayedIndices, setPracticePlayedIndices] = useState([]);

  const [practiceGame, setPracticeGame] = useState(null);
  const [boardFen, setBoardFen] = useState("");

  /* счётчики */
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [userHasMoved, setUserHasMoved] = useState(false);
  const [lastMoveCorrect, setLastMoveCorrect] = useState(null);
  const [lastExpectedFEN, setLastExpectedFEN] = useState(null);

  /* таймер обдумывания */
  const [moveStartTime, setMoveStartTime] = useState(null);

  const ready = !practiceMode || (practiceMode && boardFen);

  /* индикатор сохранения статистики */
  const [isSaving, setIsSaving] = useState(false);

  /* буфер статистики за сессию */
  const [sessionStats, setSessionStats] = useState([]);

  useEffect(() => {
    if (!user) return;
    getUserOpenings({ userId: user.idUsers })
      .then((res) => {
        setOpenings(res);
        if (res.length) {
          setSelectedOpeningId(res[0].opening.idOpenings);
        }
      })
      .catch((err) => console.error("Failed to load openings:", err));
  }, [user]);

  useEffect(() => {
    if (!selectedOpeningId) return;
    getOpeningMoves({ openingId: selectedOpeningId })
      .then((res) => {
        setOpeningMoves(res);
        setCurrentMoveIndex(0);
        setStartedLearning(false);
        setCorrectCount(0);
        setIncorrectCount(0);
        setPracticePlayedIndices([]);
        setPracticeGame(null);
        setBoardFen("");
        setPracticeCurrentIndex(null);
      })
      .catch((err) => console.error("Failed to load moves:", err));
  }, [selectedOpeningId]);

  /* вспомогательные функции */
  const samePosition = (fenA, fenB) => {
    if (!fenA || !fenB) return false;
    return fenA.split(" ")[0] === fenB.split(" ")[0];
  };

  const updatePracticeGame = useCallback(
    (index) => {
      if (index == null || index >= openingMoves.length) return;
      const g = new Chess(openingMoves[index].FEN);
      setPracticeGame(g);
      setBoardFen(g.fen());
    },
    [openingMoves]
  );

  const pickRandomPracticeIndex = useCallback(
    (lastIndex) => {
      const item = openings.find(
        (o) => o.opening.idOpenings === selectedOpeningId
      );
      if (!item) return null;
      const isWhite = item.opening.as === "w";

      const valid = openingMoves
        .map((_, i) => i)
        .filter(
          (i) =>
            i < openingMoves.length - 1 &&
            ((isWhite && openingMoves[i].MoveNumber % 2 === 0) ||
              (!isWhite && openingMoves[i].MoveNumber % 2 === 1))
        );

      const fresh = valid.filter((i) => !practicePlayedIndices.includes(i));
      let pool = fresh.length ? fresh : valid;
      if (lastIndex != null) {
        const withoutLast = pool.filter((i) => i !== lastIndex);
        pool = withoutLast.length ? withoutLast : pool;
      }
      const choice = pool[Math.floor(Math.random() * pool.length)];
      setPracticePlayedIndices((p) =>
        p.includes(choice) ? p : [...p, choice]
      );
      return choice;
    },
    [openingMoves, openings, practicePlayedIndices, selectedOpeningId]
  );

  useEffect(() => {
    if (practiceMode && openingMoves.length >= 1) {
      const idx = pickRandomPracticeIndex(null);
      setPracticeCurrentIndex(idx);
      updatePracticeGame(idx);
      setMoveStartTime(Date.now());
    } else {
      setPracticeCurrentIndex(null);
      setPracticeGame(null);
      setBoardFen("");
    }
  }, [practiceMode, openingMoves, pickRandomPracticeIndex, updatePracticeGame]);

  /* обработчики «Учебного» режима */
  const handleNextMove = () =>
    setCurrentMoveIndex((i) => (i < openingMoves.length - 1 ? i + 1 : i));
  const handlePreviousMove = () =>
    setCurrentMoveIndex((i) => (i > 0 ? i - 1 : i));

  /* обработчики PRACTICE-режима */
  const handlePracticeDrop = (from, to) => {
    if (!practiceGame || userHasMoved) return false;
    const item = openings.find(
      (o) => o.opening.idOpenings === selectedOpeningId
    );
    if (!item) return false;
    const piece = practiceGame.get(from);
    if (!piece || piece.color !== item.opening.as) return false;

    const mv = practiceGame.move({ from, to, promotion: "q" });
    if (!mv) return false;

    const newFen = practiceGame.fen();
    setBoardFen(newFen);

    const expected = openingMoves[practiceCurrentIndex + 1]?.FEN;
    setLastExpectedFEN(expected);

    const isCorrect = samePosition(newFen, expected);
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      setLastMoveCorrect(true);
    } else {
      setIncorrectCount((c) => c + 1);
      setLastMoveCorrect(false);
    }

    // вычисляем время обдумывания в секундах, ограничиваем до 300
    const now = Date.now();
    const deltaSec = Math.round((now - (moveStartTime || now)) / 1000);
    const timeToThink = Math.min(deltaSec, 300);

    setSessionStats((prev) => [
      ...prev,
      {
        idStatistics: uuidv4(),
        UserID: user.idUsers,
        MoveID: practiceCurrentIndex,
        IsMoveCorrect: isCorrect,
        TimeToThink: timeToThink,
      },
    ]);

    setUserHasMoved(true);
    return true;
  };

  const handleNextPractice = () => {
    const idx = pickRandomPracticeIndex(practiceCurrentIndex);
    setPracticeCurrentIndex(idx);
    updatePracticeGame(idx);
    setUserHasMoved(false);
    setLastMoveCorrect(null);
    setLastExpectedFEN(null);
    setMoveStartTime(Date.now());
  };

  const handleShowCorrect = () => {
    if (!lastExpectedFEN) return;
    const g = new Chess(lastExpectedFEN);
    setPracticeGame(g);
    setBoardFen(g.fen());
  };

  /* сохранение статистики при завершении сессии */
  const handleSessionEnd = useCallback(() => {
    if (!practiceMode || sessionStats.length === 0) return;
    setIsSaving(true);
    createUserStatisticsBatch(sessionStats)
      .then(() => {
        setSessionStats([]);
      })
      .catch((err) => console.error("Failed to send statistics:", err))
      .finally(() => {
        setIsSaving(false);
      });
  }, [practiceMode, sessionStats]);

  const togglePractice = () => {
    if (practiceMode) {
      handleSessionEnd();
    }
    setPracticeMode((m) => !m);
    setStartedLearning(false);
    setCurrentMoveIndex(0);
  };

  const openingDescription = openingMoves[currentMoveIndex]?.Description;

  return (
    <div className="flex flex-col h-screen w-screen overflow-x-hidden">
      {children}

      <div className="flex flex-row gap-2 w-full p-4">
        <div className="flex flex-col md:ml-10">
          <span className="text-sm font-aldrich text-[#868686]">Дебют</span>
          <select
            className="bg-[#434343] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[33%]"
            value={selectedOpeningId || ""}
            onChange={(e) => {
              setSelectedOpeningId(Number(e.target.value));
              setCurrentMoveIndex(0);
            }}
            disabled={practiceMode || isSaving}
          >
            <option disabled value="">
              Выберите дебют...
            </option>
            {openings.map((o) => (
              <option key={o.opening.idOpenings} value={o.opening.idOpenings}>
                {o.opening.OpeningName}
              </option>
            ))}
          </select>
        </div>

        {openings.length > 0 && openingMoves.length !== 0 && (
          <button
            onClick={togglePractice}
            disabled={isSaving}
            className="ml-auto md:mr-10 bg-[#474747] hover:bg-[#636363] text-white font-semibold rounded-lg shadow-md px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving
              ? "Сохранение..."
              : practiceMode
              ? "Закончить тренировку"
              : "Начать тренировку"}
          </button>
        )}
      </div>

      {openings.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-xl text-gray-400">У вас нет доступных дебютов.</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center flex-1 md:justify-center sm:gap-10 gap-3 p-4">
          {!practiceMode && (
            <div className="sm:w-[30vw] sm:h-[63.2vh] w-[90vw] md:h-[35vh] flex flex-col sm:gap-3 gap-2 font-actor">
              {openingMoves.length === 0 ? (
                <p className="text-white">
                  В данном дебюте отсутствуют ходы для изучения.
                </p>
              ) : !startedLearning ? (
                <button
                  className="bg-[#474747] font-aldrich font-semibold hover:bg-[#636363] text-white py-4 md:py-14 px-6 rounded-lg shadow-md transition duration-300 md:mb-0 mb-12"
                  onClick={() => {
                    setStartedLearning(true);
                    setCurrentMoveIndex(0);
                  }}
                >
                  Начать изучение дебюта
                </button>
              ) : (
                <>
                  <div className="bg-[#434343] w-full md:h-full h-32 text-white p-3 sm:text-[2.5vh] text-[2vh]Whitespace-pre-line overflow-y-auto rounded-2xl select-none">
                    {openingDescription || "No move description available."}
                  </div>
                  <div className="flex flex-row gap-5">
                    <MoveButton
                      orientation="left"
                      status={currentMoveIndex > 0 ? "active" : "inactive"}
                      onClick={handlePreviousMove}
                    />
                    <MoveButton
                      orientation="right"
                      status={
                        currentMoveIndex < openingMoves.length - 1
                          ? "active"
                          : "inactive"
                      }
                      onClick={handleNextMove}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <div
            className={`z-0 w-[395px] h-[395px] md:w-[600px] md:h-[600px] sm:w-[400px] sm:h-[400px] ${practiceMode ? "flex flex-col items-center justify-center" : ""}`}
          >
            {practiceMode && (
              <div className="flex flex-col items-center justify-center">
                <span className="mb-5 md:mt-0 mt-44 text-[26px]">
                  Найди лучший ход!
                </span>
                <div className="mb-8">
                  <span className="text-green-600">
                    Правильных ходов: {correctCount}
                  </span>
                  <span> | </span>
                  <span className="text-red-600">
                    Неправильных ходов: {incorrectCount}
                  </span>
                </div>
              </div>
            )}

            {ready && (
              <Chessboard
                position={
                  practiceMode
                    ? boardFen
                    : startedLearning
                    ? openingMoves[currentMoveIndex]?.FEN || ""
                    : undefined
                }
                animationDuration={0}
                arePiecesDraggable={practiceMode && !userHasMoved}
                onPieceDrop={practiceMode ? handlePracticeDrop : undefined}
              />
            )}

            <div className="mt-4 flex justify-center space-x-4">
              {practiceMode && (
                <>
                  <button
                    onClick={handleNextPractice}
                    disabled={!userHasMoved}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Следующий ход
                  </button>
                  {lastMoveCorrect === false && (
                    <button
                      onClick={handleShowCorrect}
                      disabled={!userHasMoved}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Показать правильный ход
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl">
          Сохранение сессии…
        </div>
      )}
    </div>
  );
};

export default LearnPage;
