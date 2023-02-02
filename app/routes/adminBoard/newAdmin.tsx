import { ActionFunction, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { createAdmin } from "~/models/admin.server";
import { createMentor } from "~/models/mentor.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("name");
  const passwordHash = form.get("password");
  const role = "admin";
  console.log(username, passwordHash);
  await createAdmin({ username, passwordHash, role });
  return redirect("..");
};

const newAdmin =()=>{
    return (
        <div className="add-container">
             <div className="form-container">
          <form method="post" className="add-form" style={{backgroundColor:"gray"}}>
            <div className="form-header" style={{color:"white"}}>
              {" "}
              <h2>New Admin Account</h2>
              <Link to={".."}>X</Link>
            </div>
            <label>ِAdmin Name</label>
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
              Create Admin Account
            </button>
          </form>
          </div>
        </div>
      );
}

export default newAdmin