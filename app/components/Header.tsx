import { Link } from "@remix-run/react";
type prop = {
  username: string | undefined;
};
const Header = ({ username }: prop) => {
  return (
    <header>
      <h2>
        <Link to="/tasks">
          <span className="title"><span style={{color:'orange'}}>Admin</span>Swapy +</span>
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