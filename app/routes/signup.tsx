import {
  ActionArgs,
  ActionFunction,
  json,
  LinksFunction,
  redirect,
} from "@remix-run/node";
import { Link, useActionData, useSearchParams } from "@remix-run/react";
import { createUser } from "~/models/user.server";
import stylesUrl from "~/styles/login.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

type ActionData =
  | {
      username: null | string;
      password: null | string;
    }
  | undefined;

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const name = form.get("username");
  const password = form.get("password");
  const AnyMissingDataError = {
    username: name ? null : "name is reqired",
    password: password ? null : "password is reqired",
  };
  if (Object.values(AnyMissingDataError).some((el) => el)) {
    return json<ActionData>(AnyMissingDataError);
  }
  await createUser({ username: name, passwordHash: password });
  return redirect("..");
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const AnyMissingDataError = useActionData() as ActionData;
  return (
    <div className="container">
      <div className="content" data-light="">
        <h1 style={{ fontSize: 37, color: "#497174" }}>Sign up</h1>
        <form method="post">
          <div>
            <label htmlFor="username-input">
              Username{" "}
              {AnyMissingDataError?.username ? (
                <em style={{ color: "red" }}>{AnyMissingDataError.username}</em>
              ) : null}
            </label>
            <input
              type="text"
              id="username-input"
              name="username"
              style={{ color: "black" }}
            />
          </div>
          <div>
            <label htmlFor="password-input">
              Password
              {AnyMissingDataError?.password ? (
                <em style={{ color: "red" }}>{AnyMissingDataError.password}</em>
              ) : null}
            </label>
            <input
              id="password-input"
              name="password"
              type="password"
              style={{ color: "black" }}
            />
          </div>
          <button type="submit" className="button">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
