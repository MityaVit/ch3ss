import { useState } from "react";
import { AuthModal } from "../../modals/auth";
import { useAuth } from "../../../AuthProvider";
import { useNavigate } from "react-router-dom";

const HomePage = ({ children }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen w-screen overflow-x-hidden text-gray-100">
      {children}
      <main className="flex-1 overflow-y-auto">
        <section className="relative flex flex-col items-center justify-center h-screen px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Поднимите свой уровень игры в шахматы
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-6 text-gray-300">
            Организуйте учебные группы, осваивайте дебюты, отрабатывайте позиции и отслеживайте прогресс — всё в одной платформе.
          </p>
          <button
            onClick={() => {
              if (user) {
                navigate("/groups");
              } else {
                setAuthModalOpen(true);
              }
            }}
            className="px-8 py-3 bg-[#434343] hover:bg-gray-200 hover:text-black rounded-md transition"
          >
            Начать
          </button>
        </section>

        <section className="py-20 px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold">
              Управление группами в одном решении
            </h2>
            <p className="text-gray-400">
              Создавайте и организуйте классы, назначайте преподавателей и приглашайте студентов в специально подобранные учебные группы. Идеально для школ, клубов или частных репетиторов.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "Изучение дебютов",
                desc: "Выбирайте из обширной базы классических и современных дебютов — или создайте свои собственные.",
              },
              {
                title: "Режим практики",
                desc: "Отрабатывайте случайные позиции из любого дебюта для оттачивания тактики и углубления понимания.",
              },
              {
                title: "Статистика",
                desc: "Отслеживайте индивидуальные и групповые показатели с помощью графиков точности, скорости и запоминания.",
              },
              {
                title: "Пользовательские дебюты",
                desc: "Преподаватели могут создавать индивидуальные репертуары для студентов, адаптированные к уровню навыков.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-[#2C2C2B] p-6 rounded-xl shadow-lg transform hover:scale-105 transition"
              >
                <h3 className="text-2xl font-medium mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#434343] py-20 px-6 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">Почему Ch3ss?</h2>
          <p className="text-gray-300 max-w-3xl mx-auto mb-8">
            Мы сочетаем структурированное обучение с динамичной практикой. Следите за ростом в реальном времени, сотрудничайте с коллегами и достигайте мастерства благодаря аналитике на основе данных.
          </p>
        </section>

        <footer className="py-6 px-6 md:px-12 text-center text-gray-500">
          © {new Date().getFullYear()} Ch3ss. Все права защищены.
        </footer>
      </main>
      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      )}
    </div>
  );
};

export default HomePage;
