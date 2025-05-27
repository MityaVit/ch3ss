// src/pages/AnalyticsPage.jsx
import { useState, useMemo, useEffect, useRef } from "react";
import {
  getUserOpenings,
  getUserOpeningsByGroupId,
  getUsernameByUserId,
} from "../../../api/users";
import {
  getOpeningAccuracy,
  getSlidingAccuracy,
  getStreaks,
  getWeakMoves,
  getUserGroupStatistics,
  getAvgTime,
} from "../../../api/statistics";
import { useAuth } from "../../../AuthProvider";
import { Chart, registerables } from "chart.js";
import { useLocation, useNavigate } from "react-router-dom";

const AnalyticsPage = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const studentId = params.get("studentId");
  const groupId = params.get("groupId");
  const isCoach = user?.role === "Coach";
  const effectiveUserId =
    studentId && isCoach && groupId ? studentId : user?.idUsers;

  const [targetUser, setTargetUser] = useState(null);
  const [openings, setOpenings] = useState([]);
  const [chosenOpening, setChosenOpening] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const chartRef = useRef(null);

  useEffect(() => {
    if (isCoach && studentId) {
      getUsernameByUserId(studentId)
        .then((data) => setTargetUser(data.username || data))
        .catch(console.error);
    }
  }, [studentId, isCoach]);

  useEffect(() => {
    if (!effectiveUserId) return;
    const loader =
      isCoach && studentId && groupId
        ? () => getUserOpeningsByGroupId({ userId: effectiveUserId, groupId })
        : () => getUserOpenings({ userId: effectiveUserId });
    loader()
      .then((data) => setOpenings(data))
      .catch(console.error);
  }, [effectiveUserId, isCoach, studentId, groupId]);

  const filtered = useMemo(() => {
    const t = searchTerm.toLowerCase().trim();
    return t
      ? openings.filter((o) =>
          (o.opening?.OpeningName || o.OpeningName).toLowerCase().includes(t)
        )
      : openings;
  }, [openings, searchTerm]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleClick = (opening) => {
    const gid = opening.groupId || groupId;
    Promise.all([
      getOpeningAccuracy({ userId: effectiveUserId, groupId: gid }),
      getSlidingAccuracy({
        userId: effectiveUserId,
        groupId: gid,
      }),
      getStreaks({ userId: effectiveUserId, groupId: gid }),
      getWeakMoves({
        userId: effectiveUserId,
        groupId: gid,
      }),
      getUserGroupStatistics({ userId: effectiveUserId, groupId: gid }),
      getAvgTime({ userId: effectiveUserId, groupId: gid }),
    ])
      .then(([acc, slide, streaks, weak, history, avgTimeResponse]) => {
        setChosenOpening({
          ...opening,
          accuracy: acc.accuracy,
          slidingAccuracy: slide.slidingAccuracy,
          streaks,
          weakMoves: weak,
          statsHistory: history,
          avgTime: avgTimeResponse.averageTime,
        });
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (!chosenOpening?.statsHistory) return;
    if (chartRef.current) chartRef.current.destroy();
    Chart.register(...registerables);
    const sortedHistory = [...chosenOpening.statsHistory].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    const ctx = document.getElementById("progressChart").getContext("2d");
    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: sortedHistory.map((i) =>
          new Date(i.createdAt).toLocaleDateString()
        ),
        datasets: [
          {
            label: "Точность",
            data: sortedHistory.map((i) => i.accuracy),
            tension: 0.1,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: { title: { display: true, text: "Дата" } },
          y: {
            title: { display: true, text: "Точность" },
            min: 0,
            max: 1,
          },
        },
      },
    });
  }, [chosenOpening]);

  return (
    <div className="flex flex-col h-screen w-screen items-center overflow-x-hidden">
      {/* Не рендерим header, если тренер просматривает статистику */}
      {!(studentId && isCoach) && children}

      {isCoach && studentId && (
        <>
          <div className="w-full text-white py-3 px-6">
            <h1 className="text-2xl font-semibold mt-10">
              Аналитика ученика {targetUser || studentId}
            </h1>
            <p className="mt-1 text-gray-400 text-sm">
              Здесь вы можете просмотреть, как ученик справляется с дебютами,
              назначенными вашей группой.
            </p>
          </div>
          <div className="w-full px-6 pt-4 flex justify-start">
            <button
              onClick={() => navigate(-1)}
              className="bg-[#505050] text-white px-4 py-2 rounded hover:bg-[#585858] transition"
            >
              ← Вернуться
            </button>
          </div>
        </>
      )}

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 px-6 py-6 w-full flex-1">
        {chosenOpening && (
          <div className="flex flex-col items-center bg-[#434343] rounded-lg shadow-lg border border-gray-600 p-6 w-full md:w-1/2 max-w-md h-[70vh] overflow-y-auto">
            <h2 className="text-center text-2xl font-semibold text-white mb-4">
              {chosenOpening.opening?.OpeningName || chosenOpening.OpeningName}
            </h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 w-full mb-4">
              <div>
                <dt className="text-gray-300 text-sm">Общая точность</dt>
                <dd className="text-white text-lg font-medium">
                  {(chosenOpening.accuracy * 100).toFixed(1)}%
                </dd>
              </div>
              <div>
                <dt className="text-gray-300 text-sm">Точность (30 дней)</dt>
                <dd className="text-white text-lg font-medium">
                  {(chosenOpening.slidingAccuracy * 100).toFixed(1)}%
                </dd>
              </div>
              <div>
                <dt className="text-gray-300 text-sm">Текущая серия</dt>
                <dd className="text-white text-lg font-medium">
                  {chosenOpening.streaks.currentStreak}
                </dd>
              </div>
              <div>
                <dt className="text-gray-300 text-sm">Макс. серия</dt>
                <dd className="text-white text-lg font-medium">
                  {chosenOpening.streaks.maxStreak}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-gray-300 text-sm">Слабые ходы</dt>
                <dd className="text-white text-lg font-medium">
                  {chosenOpening.weakMoves.length
                    ? chosenOpening.weakMoves.map((m) => m.moveId).join(", ")
                    : "Нет явных слабых ходов"}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-gray-300 text-sm">Среднее время на ход</dt>
                <dd className="text-white text-lg font-medium">
                  {chosenOpening.avgTime !== undefined
                    ? `${Number(chosenOpening.avgTime).toFixed(1)} сек`
                    : "—"}
                </dd>
              </div>
            </dl>
            <div className="w-full flex-1">
              <canvas id="progressChart" className="w-full h-full" />
            </div>
          </div>
        )}

        <div className="flex flex-col bg-[#434343] rounded-lg shadow-lg p-6 w-full md:w-1/3 max-w-sm">
          <h3 className="text-xl font-semibold text-white text-center mb-4">
            {isCoach && studentId ? "Дебюты ученика" : "Ваши дебюты"}
          </h3>
          <input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="mb-4 px-3 py-2 bg-[#505050] text-[#A69F9F] rounded border border-[#605e5e] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex-1 overflow-y-auto space-y-2 w-full">
            {paginated.length ? (
              paginated.map((o) => {
                const name = o.opening?.OpeningName || o.OpeningName;
                const key = o.opening?.idOpenings || o.idOpenings;
                return (
                  <div
                    key={key}
                    onClick={() => handleClick(o)}
                    className="p-3 bg-[#505050] hover:bg-[#585858] rounded-lg cursor-pointer text-center text-white transition"
                  >
                    {name}
                  </div>
                );
              })
            ) : (
              <p className="text-[#818181] text-center">Дебюты не найдены.</p>
            )}
          </div>
          <div className="mt-4 flex justify-between items-center w-full">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-[#505050] rounded hover:bg-[#585858] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Пред.
            </button>
            <span className="text-white">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-[#505050] rounded hover:bg-[#585858] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              След.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
