import { ActionFunction, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { createMentor } from "~/models/mentor.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("name");
  const passwordHash = form.get("password");
  const role = "mentor";
  console.log(username, passwordHash);
  await createMentor({ username, passwordHash, role });
  return redirect("..");
};

const newMentor = () => {
  return (
    <div className="add-container">
      <form method="post" className="add-form">
        <div className="form-header">
          {" "}
          <h2>New Mentor Account</h2>
          <Link to={".."}>X</Link>
        </div>
        <label>Mentor Name</label>
        <input
          type={"text"}
          required
          minLength={3}
          name="name"
          style={{ color: "black" }}
        />
        <label>Password</label>
        <input
          required
          minLength={3}
          name="password"
          type="password"
          style={{ color: "black" }}
        />
        <button type="submit" className="button">
          Create Mentor Account
        </button>
      </form>
    </div>
  );
};

export default newMentor;
