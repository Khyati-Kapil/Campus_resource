type ApprovalDecision = "AUTO" | "MANUAL";

type ResourceInfo = {
  type: "CLASSROOM" | "LABORATORY" | "EQUIPMENT";
};

export class ApprovalPolicyService {
  evaluate(resource: ResourceInfo, startTime: Date, requesterRole: string): ApprovalDecision {
    if (resource.type === "LABORATORY") {
      return "MANUAL";
    }

    if (resource.type === "EQUIPMENT") {
      return requesterRole === "FACULTY" || requesterRole === "ADMIN" ? "AUTO" : "MANUAL";
    }

    const hour = startTime.getHours();
    const isBusinessHours = hour >= 8 && hour <= 18;
    if (resource.type === "CLASSROOM" && isBusinessHours) {
      return "AUTO";
    }

    return "MANUAL";
  }
}
