import { Columns, task, Trainee } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "invariant";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { getColumns, getTasksBasedTraineeId } from "~/models/task.server";
import {
  getTraineeBasedId,
  getTraineeBasedName,
} from "~/models/trainee.server";
import { getTrainee } from "~/models/user.server";

type loaderData = {
  columns: Columns[];
  traineeName: string | undefined;
  Tasks: task[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const columns = await getColumns();
  invariant(params.id, "not NULL");
  const trainee = await getTraineeBasedId(params.id);
  const ListOfTasks = await getTasksBasedTraineeId(params.id);
  console.log(ListOfTasks);

  console.log(trainee);
  return json<loaderData>({
    columns: columns,
    traineeName: trainee?.username,
    Tasks: ListOfTasks,
  });
};

function getClassName(coulmnName: string): string {
  switch (coulmnName) {
    case "to Do":
      return "to-Do-container";
      break;
    case "in Progress":
      return "in-progress-container";
      break;
    default:
      return "Done-container";
  }
}

const $id = () => {
  const { columns, traineeName, Tasks } = useLoaderData() as loaderData;
  const [winReady, setwinReady] = useState(false);
  const onDragEnd = async (
    result,
    columns: Awaited<ReturnType<typeof getColumns>>
  ) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      console.log("1");
      const sourceColumn = columns[source.droppableId];
      console.log("source", sourceColumn);
      const destColumn = columns[destination.droppableId];
      console.log("dest", destColumn);
      const sourceItems = Tasks.filter(
        (task) => task.ColumnsId == sourceColumn.id
      );
      const desttasks = Tasks.filter((task) => task.ColumnsId == destColumn.id);
      console.log("task", desttasks);
      const [removed] = sourceItems.splice(source.index, 1);
      removed.ColumnsId = destColumn.id;
    } else {
      console.log("2");
      const column = columns[source.droppableId];
      const copiedtasks = Tasks.filter((task) => task.ColumnsId == column.id);
      const [removed] = copiedtasks.splice(source.index, 1);
      copiedtasks.splice(destination.index, 0, removed);
    }
  };

  useEffect(() => {
    setwinReady(true);
  }, []);
  return (
    <div className="trainee-view-container">
      {winReady && (
        <main className="tasks-main">
          <h2>{traineeName} Board 👊</h2>
          <DragDropContext onDragEnd={(result) => onDragEnd(result, columns)}>
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <Droppable key={columnId} droppableId={columnId}>
                  {(provided, snapshot) => {
                    const tasks = Tasks.filter(
                      (task) => task.ColumnsId === column.id
                    );
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="main-child"
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "white",
                        }}
                      >
                        <div className={`${getClassName(column.title)}`}>
                          <h3>
                            {column.title} {provided.placeholder}
                          </h3>
                        </div>
                        <Link className="new" to={column.id}>
                          New +
                        </Link>
                        {tasks.map((task, index) => {
                          return (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided) => {
                                return (
                                  <Link
                                    to={`./task/${task.id}`}
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                    className={
                                      column.title == "Done"
                                        ? "Done-task"
                                        : "single-task"
                                    }
                                  >
                                    {column.title == "Done" ? (
                                      <s>{task.title}</s>
                                    ) : (
                                      task.title
                                    )}
                                    {/* <div className="btn-container">
                                      <button>Delete</button>
                                      <button>Edit</button>
                                    </div> */}
                                  </Link>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                      </div>
                    );
                  }}
                </Droppable>
              );
            })}
          </DragDropContext>
          <Outlet />
        </main>
      )}
    </div>
  );
};

export default $id;
