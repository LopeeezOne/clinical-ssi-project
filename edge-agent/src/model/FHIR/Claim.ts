export interface Claim {
    resourceType: "Claim";
    id: string;
    status: ClaimStatus;
    use: ClaimUse;
    patient: Reference;
    billablePeriod?: Period;
    organization?: Reference;
    diagnosis?: ClaimDiagnosis[];
    item?: ClaimItem[];
    total?: Money;
}

type ClaimStatus = "active" | "cancelled" | "draft" | "entered-in-error";
type ClaimUse = "claim" | "preauthorization" | "predetermination";

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

interface ClaimDiagnosis {
    sequence: number;
    diagnosisReference: Reference;
}

interface ClaimItem {
    sequence: number;
    encounter?: Reference[];
    diagnosisLinkId?: number[];
}

interface CodeableConcept {
    coding?: Coding[];
    text?: string;
}

interface Coding {
    system?: string;
    version?: string;
    code?: string;
    display?: string;
    userSelected?: boolean;
}

interface Money {
    value?: number;
    currency?: string;
    code?: string;
}