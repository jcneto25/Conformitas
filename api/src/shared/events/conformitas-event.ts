export abstract class ConformitasEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly aggregateType: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
