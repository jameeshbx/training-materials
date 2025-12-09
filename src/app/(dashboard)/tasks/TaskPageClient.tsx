"use client";

import { useTranslations } from "next-intl";
import TaskList from "./TaskList";

type Props = {
  isAuth: boolean;
};

export default function TaskPageClient({ isAuth }: Props) {
  const t = useTranslations("TasksPage");

  if (!isAuth) {
    return <p className="text-red-500">{t("notAuth")}</p>;
  }

  return (
    <div className="p-8 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>

        <a
          href="/tasks/new"
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          {t("newTask")}
        </a>
      </div>

      <TaskList />
    </div>
  );
}
