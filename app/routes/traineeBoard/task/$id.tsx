import { ActionFunction, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "react-router";
import {
  deleteTask,
  getSingleColumn,
  getSingleTask,
} from "~/models/task.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const singleTask = await getSingleTask(params.id);
  const singleCoulmn = await getSingleColumn(singleTask?.ColumnsId);
  return json({
    title: singleTask?.title,
    content: singleTask?.content,
    coulmnTitle: singleCoulmn?.title,
    created: singleTask?.createdAt.toString().slice(0, 21),
    updated: singleTask?.updatedAt.toString().slice(0, 21),
    id: params.id,
  });
};
export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const SubmitBtn = form.get("subBtn");
  if (SubmitBtn === "delete") {
    await deleteTask(params.id);
    return redirect("..");
  } else {
    console.log("Edit !!");
  }
  return null;
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
  const { title, content, coulmnTitle, created, updated, id } = useLoaderData();
  return (
    <div className="single-task-container">
      <div className="single-task-container-header">
        <Link to={".."} style={{ color: "black" }}>
          x
        </Link>
      </div>

      <div className="data-container">
        <form className="single-task-form" method="post">
          <h2>{title}</h2>
          <h5>
            Status:{" "}
            <span className={`${getClassName(coulmnTitle)}`}>
              {coulmnTitle}
            </span>
          </h5>
          <h5>Created at: {created}</h5>
          <h5>Last update: {updated}</h5>
          <h4>{content}</h4>
          <button
            className="button"
            name="subBtn"
            type="submit"
            value="delete"
            style={{ backgroundColor: " rgb(245, 132, 132)" }}
          >
            Delete Task{" "}
          </button>
          <Link
            to={`../task/edit/${id}`}
            className="button"
            style={{ backgroundColor: " rgb(128, 128, 128, 0.859)" }}
          >
            Edit Task
          </Link>
        </form>
      </div>
    </div>
  );
};

export default $id;