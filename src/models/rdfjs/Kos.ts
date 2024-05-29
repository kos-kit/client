import { DatasetCore } from "@rdfjs/types";
import { getRdfInstances } from "./getRdfInstances";
import { AbstractKos } from "../AbstractKos";
import { Identifier } from "../Identifier";
import { Concept } from "./Concept";
import { skos } from "../../vocabularies";
import { identifierToString } from "../../utilities/identifierToString";
import { ConceptScheme } from "./ConceptScheme";
import { paginateIterable } from "../../utilities/paginateIterable";
import { countIterable } from "../../utilities";

export class Kos extends AbstractKos {
  constructor(private readonly dataset: DatasetCore) {
    super();
  }

  conceptByIdentifier(identifier: Identifier): Promise<Concept> {
    return new Promise((resolve) =>
      resolve(new Concept({ dataset: this.dataset, identifier: identifier })),
    );
  }

  private *conceptIdentifiers(): Iterable<Identifier> {
    yield* getRdfInstances({
      class_: skos.Concept,
      dataset: this.dataset,
      includeSubclasses: true,
    });
  }

  conceptsPage({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    return new Promise((resolve) => {
      const result: Concept[] = [];
      for (const conceptIdentifier of paginateIterable(
        this.conceptIdentifiers(),
        { limit, offset },
      )) {
        result.push(
          new Concept({
            dataset: this.dataset,
            identifier: conceptIdentifier,
          }),
        );
      }
      resolve(result);
    });
  }

  conceptsCount(): Promise<number> {
    return new Promise((resolve) =>
      resolve(countIterable(this.conceptIdentifiers())),
    );
  }

  async conceptSchemeByIdentifier(
    identifier: Identifier,
  ): Promise<ConceptScheme> {
    for (const conceptScheme of await this.conceptSchemes()) {
      if (conceptScheme.identifier.equals(identifier)) {
        return conceptScheme;
      }
    }
    throw new RangeError(identifierToString(identifier));
  }

  conceptSchemes(): Promise<readonly ConceptScheme[]> {
    return new Promise((resolve) => resolve([...this._conceptSchemes()]));
  }

  private *_conceptSchemes(): Iterable<ConceptScheme> {
    for (const identifier of getRdfInstances({
      class_: skos.ConceptScheme,
      dataset: this.dataset,
      includeSubclasses: true,
    })) {
      yield new ConceptScheme({
        dataset: this.dataset,
        identifier,
      });
    }
  }
}
