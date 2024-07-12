export interface AllergyIntolerance {
    resourceType: "AllergyIntolerance";
    id: string;
    clinicalStatus: AllergyIntoleranceClinicalStatus;
    verificationStatus: AllergyIntoleranceVerificationStatus;
    type: AllergyIntoleranceType;
    category: AllergyIntoleranceCategory[];
    criticality?: AllergyIntoleranceCriticality;
    code?: CodeableConcept;
    patient: Reference;
    assertedDate?: string;
}

type AllergyIntoleranceClinicalStatus = "active" | "inactive" | "resolved";
type AllergyIntoleranceVerificationStatus = "unconfirmed" | "confirmed" | "refuted" | "entered-in-error";
type AllergyIntoleranceType = "allergy" | "intolerance";
type AllergyIntoleranceCategory = "food" | "medication" | "environment" | "biologic";
type AllergyIntoleranceCriticality = "low" | "high" | "unable-to-assess";

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

import { View, Text } from 'react-native';