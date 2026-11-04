import React from "react";
import styles from "./StackSection.module.css";
import page from "@/styles/page.module.css";
import Container from "../ui/Container";
import Eyebrow from "../common/Eyebrow";
import StackGrid from "../common/StackGrid";
import { allStackGroups } from "@/data/services";

export const StackSection: React.FC = () => (
  <section className={styles.section} aria-labelledby="stack-title">
    <Container>
      <Eyebrow>TECHNOLOGIES</Eyebrow>
      <h2 id="stack-title" className={`t-heading ${page.sectionTitle}`}>
        Our stack
      </h2>
      <StackGrid groups={allStackGroups()} />
    </Container>
  </section>
);

export default StackSection;
