import { Literal } from "@rdfjs/types";
import { LabeledModel } from "./LabeledModel.js";
import { ConceptScheme } from "./ConceptScheme.js";
import { Concept as IConcept, NoteProperty } from "@kos-kit/models";
import { matchLiteral } from "./matchLiteral.js";
import { SemanticRelationProperty } from "@kos-kit/models";
import { skos } from "@tpluscode/rdf-ns-builders";
import { Resource } from "@kos-kit/rdf-resource";

export class Concept extends LabeledModel implements IConcept {
  inSchemes(): Promise<readonly ConceptScheme[]> {
    return new Promise((resolve) =>
      resolve(
        [
          ...this.resource.values(
            skos.inScheme,
            Resource.ValueMappers.identifier,
          ),
        ].map((identifier) => new ConceptScheme({ identifier, kos: this.kos })),
      ),
    );
  }

  get notations(): readonly Literal[] {
    return [
      ...this.resource.values(skos.notation, Resource.ValueMappers.literal),
    ];
  }

  notes(property: NoteProperty): readonly Literal[] {
    return [
      ...this.resource.values(property.identifier, (term) => {
        const literal = Resource.ValueMappers.literal(term);
        if (
          literal !== null &&
          matchLiteral(literal, {
            includeLanguageTags: this.includeLanguageTags,
          })
        ) {
          return literal;
        }
        return null;
      }),
    ];
  }

  semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly Concept[]> {
    return new Promise((resolve) =>
      resolve(
        [
          ...this.resource.values(
            property.identifier,
            Resource.ValueMappers.identifier,
          ),
        ].map((identifier) => new Concept({ identifier, kos: this.kos })),
      ),
    );
  }

  semanticRelationsCount(property: SemanticRelationProperty): Promise<number> {
    return new Promise((resolve) =>
      resolve(
        this.resource.valuesCount(
          property.identifier,
          Resource.ValueMappers.identifier,
        ),
      ),
    );
  }

  topConceptOf(): Promise<readonly ConceptScheme[]> {
    return new Promise((resolve) =>
      resolve(
        [
          ...this.resource.values(
            skos.topConceptOf,
            Resource.ValueMappers.identifier,
          ),
        ].map((identifier) => new ConceptScheme({ identifier, kos: this.kos })),
      ),
    );
  }
}