import { LinksFunction } from "@remix-run/node";
import { Link } from "react-router-dom";
import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  return (
    <div className="wapper">
      <h1>Welcome!</h1>
      <Link to="./login" className="button">
        Log In
      </Link>
    </div>
  );
}
