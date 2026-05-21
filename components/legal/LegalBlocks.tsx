import { ReactNode } from "react";
import styles from "./LegalBlocks.module.css";

export function LegalHighlight({ children }: { children: ReactNode }) {
  return <div className={styles.highlight}>{children}</div>;
}

export function LegalNotice({
  title = "Importante",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className={styles.notice}>
      <p className={styles.noticeTitle}>{title}</p>
      <div className={styles.noticeBody}>{children}</div>
    </aside>
  );
}

export function LegalKeyPoints({ items }: { items: string[] }) {
  return (
    <ul className={styles.keyPoints}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
