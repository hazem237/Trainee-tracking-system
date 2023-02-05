import { Trainee } from "@prisma/client";
import { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "invariant";
import { json, Outlet } from "react-router";
import Header from "~/components/Header";
import { getTraineesBasedMentor } from "~/models/trainee.server";
import {
  createUserSession,
  getAdmin,
  getMentor,
  getTrainee,
} from "~/models/user.server";
import stylesUrl from "~/styles/adminBoard.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

type LoaderData = {
  MentorName: string;
  ListOfTrainee: Trainee[];
  MentorTrainess: number;
};

export const loader: LoaderFunction = async ({ request }) => {
  const Mentor = await getMentor(request);
  invariant(Mentor?.id, "Mentor id is not Null");
  const ListOfTrainee = await getTraineesBasedMentor(Mentor.id);
  

  return json<LoaderData>({
    MentorName: Mentor?.username,
    ListOfTrainee,
    MentorTrainess: ListOfTrainee.length,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const btn = form.get("btn");
  
  // const trainee
  // return createUserSession(trainee.id, `/${trainee.role}Board`)
  return null;
};

const adminBoard = () => {
  const { MentorName, ListOfTrainee, MentorTrainess } =
    useLoaderData() as LoaderData;
  return (
    <div className="admin-container">
      <Header username={MentorName} siteTitle="Mentor" />
      <main className="mentor-main">
        <div className="Trainee-list">
          <div className="Trainee-board-title">
            <h2>Trainee Board 🔥</h2>
          </div>
          <div className="Trainees-container">
            <Link to={"allTrainees"} className="see-all">
              See all
            </Link>
            {ListOfTrainee.map((trainee) => {
              return (
                <Link
                  className="single-trainee"
                  key={trainee.id}
                  to={trainee.id}
                >
                  {trainee.username}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="personal-information">
          <div className="mentor-image">
            <img
              src={
                "https://png.pngtree.com/png-vector/20221203/ourmid/pngtree-cartoon-style-male-user-profile-icon-vector-illustraton-png-image_6489287.png"
              }
            ></img>
          </div>
          <div className="mentor-data">
            <div>
              <h4>
                Mentor : {MentorName} <br />
                Trainees : {MentorTrainess}
              </h4>
            </div>
          </div>
        </div>
      </main>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default adminBoard;
