export interface ExplanationOfBenefit {
    resourceType: "ExplanationOfBenefit";
    id: string;
    contained?: Resource[];
    extension?: Extension[];
    identifier?: Identifier[];
    status: ExplanationOfBenefitStatus;
    type?: CodeableConcept;
    patient: Reference;
    billablePeriod?: Period;
    provider?: Reference;
    organization?: Reference;
    careTeam?: CareTeam[];
    diagnosis?: Diagnosis[];
    insurance?: Insurance;
    item?: Item[];
    totalCost?: Money;
    payment?: Payment;
}

type ExplanationOfBenefitStatus = "active" | "cancelled" | "draft" | "entered-in-error";

interface Resource {
    resourceType: string;
    id?: string;
    type?: CodeableConcept;
    [key: string]: any; // allows for other properties
}

interface Extension {
    url: string;
    valueMoney?: Money;
    valueCoding?: Coding;
    valueIdentifier?: Identifier;
}

interface Identifier {
    system?: string;
    value?: string;
}

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

interface Period {
    start?: string;
    end?: string;
    extension?: Extension[];
}

interface CareTeam {
    sequence: number;
    provider: Reference;
    role?: CodeableConcept;
}

interface Diagnosis {
    extension?: Extension[];
    sequence: number;
    diagnosisReference: Reference;
    type?: CodeableConcept[];
}

interface Insurance {
    coverage: Reference;
}

interface Item {
    extension?: Extension[];
    sequence: number;
    locationCodeableConcept?: CodeableConcept;
}

interface Money {
    value?: number;
    currency?: string;
    system?: string;
    code?: string;
}

interface Payment {
    amount: Money;
}