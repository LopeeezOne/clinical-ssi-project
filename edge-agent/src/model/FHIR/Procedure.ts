export interface Procedure {
    resourceType: "Procedure";
    id: string;
    status: ProcedureStatus;
    code: CodeableConcept;
    subject: Reference;
    context?: Reference;
    performedPeriod?: Period;
}

type ProcedureStatus = "preparation" | "in-progress" | "not-done" | "on-hold" | "stopped" | "completed" | "entered-in-error" | "unknown";

interface CodeableConcept {
    coding?: Coding[];
    text?: string;
}

interface Coding {
    system?: string;
    code?: string;
    display?: string;
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