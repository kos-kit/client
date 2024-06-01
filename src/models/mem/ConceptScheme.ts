import TermSet from "@rdfjs/term-set";
import { LabeledModel } from "./LabeledModel";
import { Identifier } from "../Identifier";
import { ConceptScheme as IConceptScheme } from "../ConceptScheme";
import { mapTermToIdentifier } from "./mapTermToIdentifier";
import { skos } from "../../vocabularies";
import { paginateIterable } from "../../utilities/paginateIterable";
import { Concept } from "./Concept";
import { countIterable } from "../../utilities";

export class ConceptScheme extends LabeledModel implements IConceptScheme {
  private *topConceptIdentifiers(): Iterable<Identifier> {
    const conceptIdentifierSet = new TermSet<Identifier>();

    // ConceptScheme -> Concept statement
    for (const quad of this.dataset.match(
      this.identifier,
      skos.hasTopConcept,
      null,
    )) {
      const conceptIdentifier = mapTermToIdentifier(quad.object);
      if (
        conceptIdentifier !== null &&
        !conceptIdentifierSet.has(conceptIdentifier)
      ) {
        yield conceptIdentifier;
        conceptIdentifierSet.add(conceptIdentifier);
      }
    }

    // Concept -> ConceptScheme statement
    for (const quad of this.dataset.match(
      null,
      skos.topConceptOf,
      this.identifier,
    )) {
      const conceptIdentifier = mapTermToIdentifier(quad.subject);
      if (
        conceptIdentifier !== null &&
        !conceptIdentifierSet.has(conceptIdentifier)
      ) {
        yield conceptIdentifier;
        conceptIdentifierSet.add(conceptIdentifier);
      }
    }
  }

  topConcepts({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<readonly Concept[]> {
    return new Promise((resolve) => {
      const result: Concept[] = [];
      for (const conceptIdentifier of paginateIterable(
        this.topConceptIdentifiers(),
        { limit, offset },
      )) {
        result.push(
          new Concept({
            dataset: this.dataset,
            identifier: conceptIdentifier,
            includeLanguageTags: this.includeLanguageTags,
          }),
        );
      }
      resolve(result);
    });
  }

  topConceptsCount(): Promise<number> {
    return new Promise((resolve) =>
      resolve(countIterable(this.topConceptIdentifiers())),
    );
  }
}
