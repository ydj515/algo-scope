import type { CatalogItem } from "@/features/navigation/types";

export const dsCatalog: CatalogItem[] = [
  {
    id: "cdll",
    title: "Circular Doubly Linked List",
    description: "Insert/Remove/Search 연산을 단계별로 실행하고 pointer와 링크 변화를 시각화합니다.",
    href: "/ds/circular-doubly-linked-list",
    ctaLabel: "CDLL 시작",
    tone: "primary",
  },
  {
    id: "stack",
    title: "Stack",
    description: "Push/Pop/Peek 연산을 step 단위로 재생하며 top/bottom 변화를 학습합니다.",
    href: "/ds/stack",
    ctaLabel: "Stack 시작",
    tone: "success",
  },
  {
    id: "queue",
    title: "Queue",
    description: "Enqueue/Dequeue/Peek 연산을 step 단위로 재생하며 FIFO 동작을 학습합니다.",
    href: "/ds/queue",
    ctaLabel: "Queue 시작",
    tone: "warning",
  },
  {
    id: "tree",
    title: "Tree (BST)",
    description: "Insert/Search 연산을 step 단위로 재생하며 비교/분기 경로를 학습합니다.",
    href: "/ds/tree",
    ctaLabel: "Tree 시작",
    tone: "danger",
  },
];
