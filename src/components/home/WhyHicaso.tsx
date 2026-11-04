import React from "react";
import { KeyRound, Users, Presentation, Clock } from "lucide-react";
import styles from "./WhyHicaso.module.css";
import Container from "../ui/Container";
import Eyebrow from "../common/Eyebrow";

const items = [
  { Icon: KeyRound, title: "You own the code and IP", text: "Once the project is paid for, the code, designs and IP are yours." },
  { Icon: Users, title: "The team that builds our products builds yours", text: "The people who ship AppKavo and BillMinute work on your project." },
  { Icon: Presentation, title: "Weekly demos", text: "You see working software every week, not just status updates." },
  { Icon: Clock, title: "Hours that overlap with Europe and the Middle East", text: "We work Mon–Fri, 9:00 AM–6:00 PM IST." },
];

export const WhyHicaso: React.FC = () => (
  <section className={styles.section} aria-labelledby="why-title">
    <Container wide>
      <Eyebrow>WHY HICASO</Eyebrow>
      <h2 id="why-title" className={`t-heading ${styles.title}`}>
        Why teams work with us
      </h2>
      <ul className={styles.grid}>
        {items.map(({ Icon, title, text }) => (
          <li key={title} className={styles.item}>
            <Icon size={24} strokeWidth={1.75} color="var(--color-ink)" aria-hidden="true" />
            <h3 className="t-heading-sm">{title}</h3>
            <p className="t-subhead">{text}</p>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default WhyHicaso;
