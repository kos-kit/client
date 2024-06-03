import { Concept } from "./Concept";
import { ConceptScheme } from "./ConceptScheme";
import { Identifier } from "./Identifier";

export interface Kos {
  conceptByIdentifier(identifier: Identifier): Promise<Concept>;
  concepts(): AsyncGenerator<Concept>;
  conceptsPage(kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]>;
  conceptsCount(): Promise<number>;

  conceptSchemeByIdentifier(identifier: Identifier): Promise<ConceptScheme>;
  conceptSchemes(): Promise<readonly ConceptScheme[]>;
}
