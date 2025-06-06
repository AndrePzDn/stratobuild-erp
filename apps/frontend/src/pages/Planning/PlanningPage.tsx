import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from "@/components/ui/shadcn-io/gantt";
import useFetchData from "@/hooks/useFetchEntityData";
import type { Project, Task } from "@/types";
import { EyeIcon, Minus, Plus, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormDialog from "../Client/components/FormDialog";
import TaskFormValues from "./components/TaskForm";
import {
  PlanningSchema,
  type PlanningSchemaType,
} from "./schemas/planning.schema";
import { deleteEntity, patchEntity, postEntity } from "@/utils/connections";
import { useAuthStore } from "@/stores/authStore";
import { addMonths } from "date-fns";
import { normalizeItemToEdit } from "@/utils/normalizeFields";

export default function PlanningPage() {
  const { id } = useParams();

  const { data: fetchedData, refetch } = useFetchData<Task>("task");
  const { data: project } = useFetchData<Project>("project", id);

  const [zoom, setZoom] = useState<number>(100);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(fetchedData || []);
  const { user } = useAuthStore();

  const handleAddTask = async (date: Date) => {
    if (!user) return;
    if (!id) return;

    const newTask: PlanningSchemaType = {
      name: "Nueva Tarea",
      category: "Sin Categoria",
      progress: 0,
      startDate: date,
      endDate: addMonths(date, 1),
      status: "not_started",
      project: id,
    };

    try {
      const response = await postEntity("task", newTask, user.token);

      if (response.data.success && response.data.result) {
        const createdTask: Task = {
          _id: response.data.result._id,
          name: newTask.name,
          category: newTask.category,
          progress: newTask.progress,
          startDate: new Date(newTask.startDate),
          endDate: new Date(newTask.endDate),
          status: newTask.status,
          project: project,
        };

        setTasks((prevTasks) => [...prevTasks, createdTask]);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }

    setIsOpen(false);
    setTaskToEdit(null);
  };

  const handleDelete = async (taskId: string) => {
    if (!user) return;

    try {
      await deleteEntity("task", taskId, user.token);
      refetch();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = async (data: PlanningSchemaType) => {
    if (!user || !taskToEdit) return;

    const { token } = user;

    try {
      const res = await patchEntity("task", taskToEdit._id, data, token);

      if (res.data.success) {
        setIsOpen(false);
        setTaskToEdit(null);
        refetch();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleEditOnMove = async (
    taskId: string,
    from: Date,
    to: Date | null,
  ) => {
    if (!to || !user) return;

    const { token } = user;

    try {
      await patchEntity(
        "task",
        taskId,
        { startDate: from, endDate: to },
        token,
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? { ...task, startDate: from, endDate: to }
            : task,
        ),
      );
    } catch (error) {
      console.error("Error moving task:", error);
      refetch();
    }
  };

  const projectTasks: Task[] = tasks.filter((task) => task.project?._id === id);

  const groupedTaks: Record<string, Task[]> = projectTasks.reduce<
    Record<string, Task[]>
  >((categories, task) => {
    const categoryName = task.category;
    return {
      ...categories,
      [categoryName]: [...(categories[categoryName] || []), task],
    };
  }, {});

  const sortedGroupedTasks = Object.fromEntries(
    Object.entries(groupedTaks)
      .sort(([, tasksA], [, tasksB]) => {
        const earliestDateA = Math.min(
          ...tasksA.map((task) => new Date(task.startDate).getTime()),
        );
        const earliestDateB = Math.min(
          ...tasksB.map((task) => new Date(task.startDate).getTime()),
        );
        return earliestDateA - earliestDateB;
      })
      .map(([category, tasks]) => [
        category,
        tasks.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        ),
      ]),
  );

  useEffect(() => {
    setTasks(fetchedData);
  }, [fetchedData]);

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Planeación</h1>
        <nav className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            disabled={zoom - 20 < 60 ? true : false}
            onClick={() => setZoom(zoom - 20)}
          >
            <Minus />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            disabled={zoom + 20 > 300 ? true : false}
            onClick={() => setZoom(zoom + 20)}
          >
            <Plus />
          </Button>
        </nav>
      </header>
      <GanttProvider onAddItem={handleAddTask} zoom={zoom} range="monthly">
        <GanttSidebar>
          {Object.entries(sortedGroupedTasks).map(([group, features]) => (
            <GanttSidebarGroup key={group} name={group}>
              {features.map((feature) => (
                <GanttSidebarItem
                  key={feature._id}
                  feature={{
                    id: feature._id,
                    name: feature.name,
                    startAt: new Date(feature.startDate),
                    endAt: new Date(feature.endDate),
                  }}
                />
              ))}
            </GanttSidebarGroup>
          ))}
        </GanttSidebar>
        <GanttTimeline>
          <GanttHeader />
          <GanttFeatureList>
            {Object.entries(sortedGroupedTasks).map(([category, tasks]) => (
              <GanttFeatureListGroup key={category}>
                {tasks.map((task) => (
                  <div className="flex" key={task._id}>
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <button type="button">
                          <GanttFeatureItem
                            onMove={(_, from, to) => {
                              handleEditOnMove(task._id, from, to);
                            }}
                            id={""}
                            startAt={new Date(task.startDate)}
                            endAt={new Date(task.endDate)}
                            name={task.name}
                          >
                            <p className="flex-1 truncate text-xs">
                              {task.name}
                            </p>
                          </GanttFeatureItem>
                        </button>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          className="flex items-center gap-2"
                          onClick={() => {
                            setTaskToEdit(task);
                            setIsOpen(true);
                          }}
                        >
                          <EyeIcon
                            size={16}
                            className="text-muted-foreground"
                          />
                          Ver tarea
                        </ContextMenuItem>
                        <ContextMenuItem
                          className="flex items-center gap-2 text-destructive"
                          onClick={() => handleDelete(task._id)}
                        >
                          <TrashIcon size={16} />
                          Eliminar tarea
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </div>
                ))}
              </GanttFeatureListGroup>
            ))}
          </GanttFeatureList>
          <GanttToday className="text-white bg-black" />
        </GanttTimeline>
      </GanttProvider>
      <FormDialog
        title="Crear Tarea"
        schema={PlanningSchema}
        handleOpen={() => setIsOpen(!isOpen)}
        onSubmit={handleEditTask}
        open={isOpen}
        trigger={false}
        initialData={
          taskToEdit
            ? normalizeItemToEdit(taskToEdit, ["project", "reports"])
            : undefined
        }
      >
        <TaskFormValues />
      </FormDialog>
    </section>
  );
}
