import { BlankNode, NamedNode } from "@rdfjs/types";
import { Concept } from "./Concept.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Kos } from "./Kos.js";
import { Option } from "fp-ts/Option";

export class NotImplementedKos implements Kos {
  conceptByIdentifier(
    _identifier: BlankNode | NamedNode<string>,
  ): Promise<Option<Concept>> {
    throw new Error("Method not implemented.");
  }
  concepts(): AsyncGenerator<Concept, any, unknown> {
    throw new Error("Method not implemented.");
  }
  conceptsPage(_kwds: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    throw new Error("Method not implemented.");
  }
  conceptsCount(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  conceptSchemeByIdentifier(
    _identifier: BlankNode | NamedNode<string>,
  ): Promise<Option<ConceptScheme>> {
    throw new Error("Method not implemented.");
  }
  conceptSchemes(): Promise<readonly ConceptScheme[]> {
    throw new Error("Method not implemented.");
  }
}
