import {
    ActionArgs,
    ActionFunction,
    json,
    LinksFunction,
    redirect,
  } from "@remix-run/node";
  import { createUserSession, login } from "~/models/user.server";
  //   import invariant from "tiny-invariant";
  //   import { createUserSession, login } from "~/model/user.server";
  
//   import stylesUrl from "~/styles/login.css";
  
//   export const links: LinksFunction = () => [
//     { rel: "stylesheet", href: stylesUrl },
//   ];
  
  type ActionData =
    | {
        username: null | string;
        password: null | string;
      }
    | undefined;
  
    export const action: ActionFunction = async ({ request }: ActionArgs) => {
      const form = await request.formData();
      const signup = form.get("signupbtn");
      if (signup === "signup") {
        return redirect("/signup");
      }
      const loginType = form.get("loginType");
  
      const username = form.get("username");
  
      const password = form.get("password");
      console.log(username, password);
      const user = await login(username, password);
      console.log({ user });
      if (!user) {
        return json({ message: "There's no user" });
      }
      const AnyMissingDataError = {
        username: username ? null : "name is reqired",
        password: password ? null : "password is reqired",
      };
      if (Object.values(AnyMissingDataError).some((el) => el)) {
        return json<ActionData>(AnyMissingDataError);
      }
      return createUserSession(user.id, "..");
    };
  
  export default function Login() {
    return (
      <div className="container">
        <div className="content" data-light="">
          <h1 style={{ fontSize: 45, color: "#497174" }}>Login</h1>
          <form method="post">
            <div>
              <label htmlFor="username-input">Username </label>
              <input type="text" id="username-input" name="username" style={{color:"black"}}/>
            </div>
            <div>
              <label htmlFor="password-input">Password</label>
              <input id="password-input" name="password" type="password" style={{color:"black"}}/>
            </div>
            <button type="submit" className="button" name="login">
              Log In
            </button>
            <button
              type="submit"
              className="button"
              name="signupbtn"
              value="signup"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    );
  }