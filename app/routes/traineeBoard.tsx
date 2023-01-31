import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { getTrainee } from "~/models/user.server";


export const loader:LoaderFunction=async({request})=>{
    console.log(await getTrainee(request))
    return null;
   }
   
const traineeBoard = () => {
  return (
    <div>traineeBoard</div>
  )
}

export default traineeBoard