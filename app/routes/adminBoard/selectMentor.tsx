import { Mentor, Trainee } from "@prisma/client";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  createMentor,
  getMentorBasedName,
  getMentors,
} from "~/models/mentor.server";
import {
  getTraineeBasedName,
  getTrainees,
  setTraineeMentor,
} from "~/models/trainee.server";

type loaderData = {
  ListOfTrainees: Partial<Trainee>[];
  ListOfMentors: Partial<Mentor>[];
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const traineeName = form.get("trainee");
  const mentorName = form.get("mentor");
  const Trainee = await getTraineeBasedName(traineeName);
  const Mentor = await getMentorBasedName(mentorName);

  console.log(Mentor);
  await setTraineeMentor(Trainee.id, Mentor.id);
  console.log(Trainee?.MentorId);
  return redirect("..");
};

export const loader: LoaderFunction = async () => {
  const ListOfTrainees = await getTrainees();
  const ListOfMentors = await getMentors();
  return json<loaderData>({ ListOfTrainees, ListOfMentors });
};

const newTrainee = () => {
  const { ListOfTrainees, ListOfMentors } = useLoaderData() as loaderData;
  return (
    <div className="add-container">
      <div className="form-container">
        <form method="post" className="add-form select-mentor">
          <div className="form-header">
            {" "}
            <h2>New Mentor Account</h2>
            <Link to={".."}>X</Link>
          </div>
          <label>Select Trainee</label>
          <select name="trainee" defaultValue="Trainee Name">
            {ListOfTrainees.map((trainee) => {
              return <option key={trainee.id}>{trainee.username}</option>;
            })}
          </select>
          <label>Select Mentor</label>
          <select name="mentor" defaultValue="Mentor Name">
            {ListOfMentors.map((mentor) => {
              return <option key={mentor.id}>{mentor.username}</option>;
            })}
          </select>
          <button className="button" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default newTrainee;
