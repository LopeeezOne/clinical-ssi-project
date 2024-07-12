export interface MedicationRequest {
    resourceType: "MedicationRequest";
    id: string;
    status: MedicationRequestStatus;
    intent: MedicationRequestIntent;
    medicationCodeableConcept: CodeableConcept;
    subject: Reference;
    context?: Reference;
    authoredOn?: string;
    requester?: MedicationRequestRequester;
    reasonReference?: Reference[];
    dosageInstruction?: DosageInstruction[];
}

type MedicationRequestStatus = "active" | "on-hold" | "cancelled" | "completed" | "entered-in-error" | "stopped" | "draft" | "unknown";
type MedicationRequestIntent = "proposal" | "plan" | "order" | "original-order" | "reflex-order" | "filler-order" | "instance-order" | "option";

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

interface MedicationRequestRequester {
    agent: Reference;
    onBehalfOf?: Reference;
}

interface DosageInstruction {
    sequence?: number;
    timing?: Timing;
    asNeededBoolean?: boolean;
    doseQuantity?: Quantity;
}

interface Timing {
    repeat?: Repeat;
}

interface Repeat {
    frequency?: number;
    period?: number;
    periodUnit?: "s" | "min" | "h" | "d" | "wk" | "mo" | "a";
}

interface Quantity {
    value?: number;
    comparator?: "<" | "<=" | ">=" | ">";
    unit?: string;
    system?: string;
    code?: string;
}