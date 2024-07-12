export interface DiagnosticReport {
    resourceType: "DiagnosticReport";
    id: string;
    status: DiagnosticReportStatus;
    code: CodeableConcept;
    subject: Reference;
    context?: Reference;
    effectiveDateTime?: string;
    issued?: string;
    result?: Reference[];
}

type DiagnosticReportStatus = "registered" | "partial" | "preliminary" | "final" | "amended" | "corrected" | "appended" | "cancelled" | "entered-in-error" | "unknown";

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