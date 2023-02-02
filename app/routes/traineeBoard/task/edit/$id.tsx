import { ActionFunction, json, LinksFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getSingleColumn, getSingleTask, updateTask } from "~/models/task.server";
import stylesUrl from "~/styles/task.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

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
export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const title=form.get("title")
  const content = form.get("content")
  await updateTask(params.id ,{title , content})
  return redirect(`../task/${params.id}`);
};

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
          <input
            name="title"
            defaultValue={title}
            style={{
              width: "fit-content",
              borderRadius: 4,
              border: "1px solid gray",
              padding: 14,
              fontSize: "large",
            }}
          />
          <h5>
            Status:{" "}
            <span className={`${getClassName(coulmnTitle)}`}>
              {coulmnTitle}
            </span>
          </h5>
          <h5>Created at: {created}</h5>
          <h5>Last update: {updated}</h5>
          <textarea
            name="content"
            defaultValue={content}
            style={{ color: "black", height: 150 }}
          />
          <button type="submit"
            className="button"
            style={{ backgroundColor: " rgb(31, 128, 88, 0.859)" }}
          >
            Save Changing
          </button >
        </form>
      </div>
    </div>
  );
};

export default $id;