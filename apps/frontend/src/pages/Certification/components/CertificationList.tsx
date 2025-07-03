import { Accordion } from "@/components/ui/accordion";
import type { Certification } from "@/types";
import CertificationItem from "./CertificationItem";

interface Props {
  certifications: Certification[];
}

export default function CertificationList({ certifications }: Props) {
  return (
    <Accordion
      type="single"
      collapsible
      className="flex w-full flex-col gap-4 items-center justify-center"
    >
      {certifications.map((certification) => (
        <CertificationItem
          key={certification._id}
          certification={certification}
        />
      ))}
    </Accordion>
  );
}
