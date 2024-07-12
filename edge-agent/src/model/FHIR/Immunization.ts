export interface Immunization {
    resourceType: "Immunization";
    id: string;
    status: ImmunizationStatus;
    notGiven: boolean;
    vaccineCode: CodeableConcept;
    patient: Reference;
    encounter?: Reference;
    date?: string;
    primarySource: boolean;
}

type ImmunizationStatus = "completed" | "entered-in-error" | "not-done";

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
