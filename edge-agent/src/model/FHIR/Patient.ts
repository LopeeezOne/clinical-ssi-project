export interface Patient {
    resourceType: "Patient";
    id: string;
    text?: Narrative;
    extension?: Extension[];
    identifier?: Identifier[];
    name?: HumanName[];
    telecom?: ContactPoint[];
    gender?: "male" | "female" | "other" | "unknown";
    birthDate?: string;
    address?: Address[];
    maritalStatus?: CodeableConcept;
    multipleBirthBoolean?: boolean;
    communication?: PatientCommunication[];
}

interface Narrative {
    status: "generated";
    div: string;
}

interface Extension {
    url: string;
    valueCoding?: Coding;
    valueString?: string;
    valueCode?: string;
    valueAddress?: Address;
    valueDecimal?: number;
    extension?: Extension[];
}

interface Identifier {
    system?: string;
    value?: string;
    type?: CodeableConcept;
}

interface HumanName {
    use?: "usual" | "official" | "temp" | "nickname" | "anonymous" | "old" | "maiden";
    family?: string;
    given?: string[];
    prefix?: string[];
}

interface ContactPoint {
    system?: "phone" | "fax" | "email" | "pager" | "url" | "sms" | "other";
    value?: string;
    use?: "home" | "work" | "temp" | "old" | "mobile";
}

interface Address {
    line?: string[];
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    extension?: Extension[];
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

interface PatientCommunication {
    language: CodeableConcept;
}