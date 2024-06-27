import {
  Concept as IConcept,
  ConceptScheme as IConceptScheme,
  Label as ILabel,
  NoteProperty,
  SemanticRelationProperty,
} from "@kos-kit/models";
import { Resource } from "@kos-kit/rdf-resource";
import TermSet from "@rdfjs/term-set";
import { Literal } from "@rdfjs/types";
import { skos } from "@tpluscode/rdf-ns-builders";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { LabeledModel } from "./LabeledModel.js";
import { matchLiteral } from "./matchLiteral.js";

export class Concept<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  >
  extends LabeledModel<LabelT>
  implements IConcept
{
  private readonly createConcept: Concept.Parameters<
    ConceptT,
    ConceptSchemeT,
    LabelT
  >["createConcept"];

  private readonly createConceptScheme: Concept.Parameters<
    ConceptT,
    ConceptSchemeT,
    LabelT
  >["createConceptScheme"];

  constructor({
    createConcept,
    createConceptScheme,
    ...labeledModelParameters
  }: Concept.Parameters<ConceptT, ConceptSchemeT, LabelT>) {
    super(labeledModelParameters);
    this.createConcept = createConcept;
    this.createConceptScheme = createConceptScheme;
  }

  inSchemes(): Promise<readonly ConceptSchemeT[]> {
    return new Promise((resolve) => {
      resolve(this._inSchemes({ topOnly: false }));
    });
  }

  private _inSchemes({
    topOnly,
  }: {
    topOnly: boolean;
  }): readonly ConceptSchemeT[] {
    const conceptSchemeIdentifiers = new TermSet<Resource.Identifier>();

    for (const quad of this.resource.dataset.match(
      null,
      skos.hasTopConcept,
      this.identifier,
    )) {
      switch (quad.subject.termType) {
        case "BlankNode":
        case "NamedNode":
          conceptSchemeIdentifiers.add(quad.subject);
          break;
      }
    }

    for (const conceptSchemeIdentifier of this.resource.values(
      skos.topConceptOf,
      Resource.ValueMappers.identifier,
    )) {
      conceptSchemeIdentifiers.add(conceptSchemeIdentifier);
    }

    if (!topOnly) {
      for (const conceptSchemeIdentifier of this.resource.values(
        skos.inScheme,
        Resource.ValueMappers.identifier,
      )) {
        conceptSchemeIdentifiers.add(conceptSchemeIdentifier);
      }
    }

    return [...conceptSchemeIdentifiers].map((identifier) =>
      this.createConceptScheme(identifier),
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
        return pipe(
          Resource.ValueMappers.literal(term),
          O.filter((literal) =>
            matchLiteral(literal, {
              includeLanguageTags: this.includeLanguageTags,
            }),
          ),
        );
      }),
    ];
  }

  semanticRelations(
    property: SemanticRelationProperty,
  ): Promise<readonly ConceptT[]> {
    return new Promise((resolve) => {
      resolve(
        [
          ...this.resource.values(
            property.identifier,
            Resource.ValueMappers.identifier,
          ),
        ].map((identifier) => this.createConcept(identifier)),
      );
    });
  }

  semanticRelationsCount(property: SemanticRelationProperty): Promise<number> {
    return new Promise((resolve) => {
      resolve(
        this.resource.valuesCount(
          property.identifier,
          Resource.ValueMappers.identifier,
        ),
      );
    });
  }

  topConceptOf(): Promise<readonly ConceptSchemeT[]> {
    return new Promise((resolve) => {
      resolve(this._inSchemes({ topOnly: true }));
    });
  }
}

export namespace Concept {
  export interface Parameters<
    ConceptT extends IConcept,
    ConceptSchemeT extends IConceptScheme,
    LabelT extends ILabel,
  > extends LabeledModel.Parameters<LabelT> {
    createConcept(identifier: Resource.Identifier): ConceptT;
    createConceptScheme(identifier: Resource.Identifier): ConceptSchemeT;
  }
}
