import {
    ActionFunction,
    json,
    LinksFunction,
    LoaderArgs,
  } from "@remix-run/node";
  import { Link, Outlet, useFetcher, useLoaderData } from "@remix-run/react";
  import React, { useEffect, useState } from "react";
  import {
    editTaskCoulmn,
    getColumns,
    getTasks,
    
  } from "~/models/task.server";
  import {
    DragDropContext,
    Draggable,
    Droppable,
    OnDragEndResponder,
  } from "react-beautiful-dnd";
  import { getTrainee, getUserId } from "~/models/user.server";
  import stylesUrl from "~/styles/task.css";
  import Header from "~/components/Header";
  
  export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: stylesUrl }];
  };
  
  type loaderData = {
    tasksListItems: Awaited<ReturnType<typeof getTasks>>;
    columns: Awaited<ReturnType<typeof getColumns>>;
    user: Awaited<ReturnType<typeof getTrainee>>;
  };
  
  export const loader = async ({ request }: LoaderArgs) => {
    const tasksListItems = await getTasks(request);
    const columns = await getColumns();
    const user = await getTrainee(request);
    return json<loaderData>({
      tasksListItems,
      user,
      columns,
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
  export default function tasks() {
    const { tasksListItems, columns, user } = useLoaderData() as loaderData;
    const [winReady, setwinReady] = useState(false);
    useEffect(() => {
      setwinReady(true);
    }, []);
  
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
        const sourceItems = tasksListItems.filter(
          (task) => task.ColumnsId == sourceColumn.id
        );
        const desttasks = tasksListItems.filter(
          (task) => task.ColumnsId == destColumn.id
        );
        console.log("task", desttasks);
        const [removed] = sourceItems.splice(source.index, 1);
        removed.ColumnsId = destColumn.id;
      } else {
        console.log("2");
        const column = columns[source.droppableId];
        const copiedtasks = tasksListItems.filter(
          (task) => task.ColumnsId == column.id
        );
        const [removed] = copiedtasks.splice(source.index, 1);
        copiedtasks.splice(destination.index, 0, removed);
      }
    };
  
    return (
      <div className="task-layout">
        <Header username={user?.username} siteTitle="Trainee" />
        {winReady && (
          <main className="tasks-main">
            <DragDropContext onDragEnd={(result) => onDragEnd(result, columns)}>
              {Object.entries(columns).map(([columnId, column], index) => {
                return (
                  <Droppable key={columnId} droppableId={columnId}>
                    {(provided, snapshot) => {
                      const tasks = tasksListItems.filter(
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
  }