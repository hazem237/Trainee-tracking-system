import { Link } from "@remix-run/react";

type prop = {
  username: string | undefined;
  siteTitle: string;
};
const Header = ({ username, siteTitle }: prop) => {
  return (
    <header>
      <h2>
        <Link to="/tasks">
          <span className="title">
            <span style={{ color: siteTitle=='Admin'?"orange":"green" }}>{siteTitle}</span>Swapy{" "}
            {siteTitle == "Admin" ? "+" : null}
          </span>
        </Link>
      </h2>
      <div className="welcome">
        <span className="Hi">{`Hi ${username}`}</span>
        <form action="/logout" method="post" className="logout-form">
          <button type="submit" className="button">
            Logout
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
