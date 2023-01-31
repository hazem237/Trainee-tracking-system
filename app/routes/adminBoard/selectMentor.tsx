import { Link } from "@remix-run/react"


const selectMentor = () => {
  return (
    <div className="add-container">
    <form method="post" className="add-form">
      <div className="form-header">
        {" "}
        <h2>New Task</h2>
        <Link to={".."}>X</Link>
      </div>
      <label>title</label>
      <input
        type={"text"}
        required
        minLength={3}
        name="title"
        style={{ color: "black" }}
      />
      <label>content</label>
      <textarea
        required
        minLength={3}
        name="content"
        style={{ color: "black" }}
      />
      <button type="submit" className="button">
        Create Mentor Account
      </button>
    </form>
  </div>
  )
}

export default selectMentor