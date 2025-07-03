import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Certification } from "@/types";

interface Props {
  certification: Certification;
}

export default function CertificationItem({ certification }: Props) {
  return (
    <AccordionItem
      key={certification._id}
      className="px-2 border rounded-lg shadow-md w-full"
      value={certification._id}
    >
      <AccordionTrigger>{certification.name}</AccordionTrigger>
      <AccordionContent className="p-4">
        <p className="mt-2">{certification.description}</p>
        <p className="mt-2">Tipo: {certification.certificationType}</p>
        <p className="mt-2">Proyecto: {certification.project.name}</p>
        {certification.certificationUrl.split(".").pop() === "pdf" ? (
          <iframe
            src={certification.certificationUrl}
            className="w-full h-[60dvh] mt-2"
            title={certification.name}
          ></iframe>
        ): (
          <img src={certification.certificationUrl} 
            alt={certification.name} 
            className="w-full h-auto mt-2 rounded-lg shadow-sm"
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
