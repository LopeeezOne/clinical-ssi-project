export interface SupplyDelivery {
    resourceType: "SupplyDelivery";
    id: string;
    status: SupplyDeliveryStatus;
    patient?: Reference;
    type?: CodeableConcept;
    suppliedItem?: SuppliedItem;
    occurrenceDateTime?: string;
}

type SupplyDeliveryStatus = "in-progress" | "completed" | "abandoned" | "entered-in-error";

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

interface SuppliedItem {
    quantity?: Quantity;
    itemCodeableConcept?: CodeableConcept;
}

interface Quantity {
    value?: number;
    comparator?: "<" | "<=" | ">=" | ">";
    unit?: string;
    system?: string;
    code?: string;
}