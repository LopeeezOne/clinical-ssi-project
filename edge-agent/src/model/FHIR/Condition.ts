export interface Condition {
    resourceType: "Condition";
    id: string;
    clinicalStatus: ConditionClinicalStatus;
    verificationStatus: ConditionVerificationStatus;
    code?: CodeableConcept;
    subject: Reference;
    context?: Reference;
    onsetDateTime?: string;
    assertedDate?: string;
}

type ConditionClinicalStatus = "active" | "recurrence" | "inactive" | "remission" | "resolved";
type ConditionVerificationStatus = "unconfirmed" | "provisional" | "differential" | "confirmed" | "refuted" | "entered-in-error";

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