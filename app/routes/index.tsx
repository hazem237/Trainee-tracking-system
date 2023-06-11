import { LinksFunction } from "@remix-run/node";
import { Link } from "react-router-dom";
import stylesUrl from "~/styles/index.css";
import Typewriter from "typewriter-effect";
import '@fortawesome/fontawesome-free/css/all.min.css';


export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  return (
    <div className="wapper">
      <h1>Welcome!</h1>
      <Typewriter
        onInit={  (typewriter) => {
          typewriter.changeDelay(70)
            .typeString(
              "Hello Dude how are you ?"
      
            )
            .callFunction(() => {
              console.log("String typed out!");
            })
            .pauseFor(2500)
            .start();
        }}
      />
      <Link to="./login" className="button">
        Log In
      </Link>
    </div>
  );
}
