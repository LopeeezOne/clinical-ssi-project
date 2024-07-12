export interface Device {
    resourceType: "Device";
    id: string;
    udi?: DeviceUdi;
    status?: DeviceStatus;
    type?: CodeableConcept;
    lotNumber?: string;
    manufactureDate?: string;
    expirationDate?: string;
    patient?: Reference;
}

interface DeviceUdi {
    deviceIdentifier: string;
    carrierHRF?: string;
}

type DeviceStatus = "active" | "inactive" | "entered-in-error" | "unknown";

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