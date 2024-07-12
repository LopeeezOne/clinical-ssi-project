export interface CarePlan {
    resourceType: "CarePlan";
    id: string;
    status: CarePlanStatus;
    intent: CarePlanIntent;
    category?: CodeableConcept[];
    subject: Reference;
    context?: Reference;
    period?: Period;
    activity?: CarePlanActivity[];
  }
  
  type CarePlanStatus = "draft" | "active" | "on-hold" | "revoked" | "completed" | "entered-in-error" | "unknown";
  type CarePlanIntent = "proposal" | "plan" | "order" | "option";
  
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
  
  interface CarePlanActivity {
    detail?: CarePlanActivityDetail;
  }
  
  interface CarePlanActivityDetail {
    code?: CodeableConcept;
    status: CarePlanActivityStatus;
  }
  
  type CarePlanActivityStatus = "not-started" | "scheduled" | "in-progress" | "on-hold" | "completed" | "cancelled" | "stopped" | "unknown" | "entered-in-error";