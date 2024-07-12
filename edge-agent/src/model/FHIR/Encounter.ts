export interface Encounter {
    resourceType: "Encounter";
    id: string;
    status: EncounterStatus;
    class: Coding;
    type?: CodeableConcept[];
    subject: Reference;
    participant?: EncounterParticipant[];
    period?: Period;
    reason?: CodeableConcept[];
    serviceProvider?: Reference;
}

type EncounterStatus = "planned" | "arrived" | "triaged" | "in-progress" | "onleave" | "finished" | "cancelled" | "entered-in-error" | "unknown";

interface Coding {
    system?: string;
    version?: string;
    code?: string;
    display?: string;
    userSelected?: boolean;
}

interface CodeableConcept {
    coding?: Coding[];
    text?: string;
}

interface Reference {
    reference?: string;
    type?: string;
    identifier?: Identifier;
    display?: string;
}

interface Identifier {
    use?: "usual" | "official" | "temp" | "secondary" | "old";
    type?: CodeableConcept;
    system?: string;
    value?: string;
    period?: Period;
    assigner?: Reference;
}

interface Period {
    start?: string;
    end?: string;
}

interface EncounterParticipant {
    individual?: Reference;
}