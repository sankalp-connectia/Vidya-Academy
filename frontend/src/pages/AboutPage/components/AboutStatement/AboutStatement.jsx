import { statement } from "../../../../cms/siteContent.js";
import "./AboutStatement.css";

export default function AboutStatement() {
  return (
    <section className="about-statement">
      <p>{statement}</p>
    </section>
  );
}
