import { Literal } from "@rdfjs/types";
import { SemanticRelationProperty } from "../SemanticRelationProperty";
import { LanguageTag } from "../LanguageTag";
import { NoteProperty } from "../NoteProperty";
import { RdfJsLabeledModel } from "./RdfJsLabeledModel";
import { ConceptScheme } from "../ConceptScheme";
import { RdfJsConceptScheme } from "./RdfJsConceptScheme";
import { skos } from "../../vocabularies";
import { Concept } from "../Concept";

export class RdfJsConcept extends RdfJsLabeledModel implements Concept {
  inSchemes(): Promise<readonly ConceptScheme[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.filterAndMapObjects(skos.inScheme, (term) =>
          term.termType === "BlankNode" || term.termType === "NamedNode"
            ? new RdfJsConceptScheme({
                dataset: this.dataset,
                identifier: term,
              })
            : null,
        ),
      ]),
    );
  }

  notes(
    languageTag: LanguageTag,
    property: NoteProperty,
  ): Promise<readonly Literal[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.filterAndMapObjects(property.identifier, (term) =>
          term.termType === "Literal" && term.language === languageTag
            ? term
            : null,
        ),
      ]),
    );
  }

  notations(): Promise<readonly Literal[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.filterAndMapObjects(skos.notation, (term) =>
          term.termType === "Literal" ? term : null,
        ),
      ]),
    );
  }

  semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly Concept[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.filterAndMapObjects(property.identifier, (term) =>
          term.termType === "NamedNode"
            ? new RdfJsConcept({ dataset: this.dataset, identifier: term })
            : null,
        ),
      ]),
    );
  }

  semanticRelationsCount(property: SemanticRelationProperty): Promise<number> {
    return new Promise((resolve) =>
      resolve(
        this.countObjects(
          property.identifier,
          (term) => term.termType === "NamedNode",
        ),
      ),
    );
  }

  topConceptOf(): Promise<readonly ConceptScheme[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.filterAndMapObjects(skos.topConceptOf, (term) =>
          term.termType === "BlankNode" || term.termType === "NamedNode"
            ? new RdfJsConceptScheme({
                dataset: this.dataset,
                identifier: term,
              })
            : null,
        ),
      ]),
    );
  }
}
