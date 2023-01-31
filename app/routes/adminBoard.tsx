import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json, Outlet } from "react-router";
import Header from "~/components/Header";
import { getAdmin } from "~/models/user.server";
import stylesUrl from "~/styles/adminBoard.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const loader: LoaderFunction = async ({ request }) => {
  console.log(await getAdmin(request));
  const admin = await getAdmin(request);
  return json({ AdminName: admin?.username });
};

const adminBoard = () => {
  const { AdminName } = useLoaderData();
  const arr = [1, 2, 3, 4];
  return (
    <div className="admin-container">
      <Header username={AdminName} />
      <Link to={"newMentor"} className="container-child">
        Create Mentor Account
      </Link>
      <Link to={"newAdmin"} className="container-child">
        Create Admin Account
      </Link>
      {/* <Link to={"newTrainee"} className="container-child">
        Create Trainee Account
      </Link> */}
      <Link to={"selectMentor"} className="container-child">
        Select Mentor to Trainee
      </Link>
      <div>
        <Outlet/>
      </div>
    </div>
  );
};

export default adminBoard;
