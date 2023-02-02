import { Trainee } from "@prisma/client";
import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "invariant";
import { json, Outlet } from "react-router";
import Header from "~/components/Header";
import { getTraineesBasedMentor } from "~/models/trainee.server";
import { getAdmin, getMentor, getTrainee } from "~/models/user.server";
import stylesUrl from "~/styles/adminBoard.css";


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

type LoaderData ={
    MentorName:string , 
    ListOfTrainee : Trainee[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const Mentor = await getMentor(request);
  invariant(Mentor?.id , "Mentor id is not Null")
  const ListOfTrainee = await getTraineesBasedMentor(Mentor.id)
  console.log(ListOfTrainee)
  return json<LoaderData>({ MentorName: Mentor?.username ,  ListOfTrainee});
};

const adminBoard = () => {
  const { MentorName ,ListOfTrainee} = useLoaderData() as LoaderData ;
  return (
    <div className="admin-container">
      <Header username={MentorName} siteTitle="Mentor" />
       <main className="mentor-main">
        <h2>Trainee Board 🔥</h2>
        <div>
        {ListOfTrainee.map((trainee)=>{
            return (
                <div className="single-trainee">{trainee.username}</div>
            )
        })}
        </div>
       </main>
    </div>
  );
};

export default adminBoard;
